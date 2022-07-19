<template>
    <div v-html="slide" class="sw-h-full sw-carousel" :style="computedStyle" ref="slideElement"></div>
</template>
<script setup lang="ts">
import { getAspectRatio } from '../utils/misc';
import { computed, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
const slideElement = ref<HTMLElement | null>(null)

const props = defineProps({
    slide: {
        type: String as PropType<string>,
        required: true,
    },
    sliderWidth: {
        type: Number,
        required: true
    },
    rootMounted: {
        type: Boolean,
        required: true
    },
    imageToShowCombinedWidth: {
        type: Number,
        required: true
    },
    parseCredits: {
        type: Boolean,
        required: false,
        default: false
    },
})


const transformText = ref('')
const width = ref(0)
const imageHeight = ref(0)
const imageWidth = ref(0)

watch(() => [props.rootMounted, props.imageToShowCombinedWidth],(val) => {
    if (val) {
        setWidth()
    }
})

const computedStyle = computed(() => {
    return {
        'aspect-ratio': `${imageWidth.value} / ${imageHeight.value}`,
        // 'width': `${width.value}px`,
        'transform': transformText.value,
    }
})

// /**
//  * 
//  * @param slide HTMLImageElement
//  */
function getWidthForSlide(slide: string, combinedWidth: number) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width / combinedWidth * props.sliderWidth

    return imageWidth
}

function getPhotographerCredits() {

    const parser = new DOMParser()
    const doc = parser.parseFromString(props.slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return '';

    const regex = /©(\s*)(.*?)( \(\d*\))(-optimized)?/g

    const match = regex.exec(img.src)
    console.log("🚀 ~ file: Slide.vue ~ line 73 ~ getPhotographerCredits ~ match", match)
    if (!match) return '';

    return match[1]
}

onMounted(() => {
    const _image = slideElement.value?.querySelector('img')
    if (props.parseCredits) {
        getPhotographerCredits()
    }
    if (_image) {
        const ratioInfo = getAspectRatio(props.slide)
        if (ratioInfo) {
            imageWidth.value = ratioInfo.width
            imageHeight.value = ratioInfo.height
        }
    }
})

onUnmounted(() => {
    // window.removeEventListener('resize', setWidth)
})

function setWidth() {
    width.value = getWidthForSlide(props.slide, props.imageToShowCombinedWidth);
}

function setWidthManualy(val: number) {
    width.value = val
}

function setTransform() {
    if (slideElement.value) {

    }
}

defineExpose({
    width,
    setWidth,
    setTransform
})

</script>