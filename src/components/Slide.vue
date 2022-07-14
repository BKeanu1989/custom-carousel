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
    // toShow: {
    //     type: Number,
    //     required: true
    // },
    imageToShowCombinedWidth: {
        type: Number,
        required: true
    },
})

// TODO: might need to determine object-fit: contain if hochkant bild

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
        'width': `${width.value}px`,
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

onMounted(() => {
    const _image = slideElement.value?.querySelector('img')
    if (_image) {
        // const parser = new DOMParser()
        // if (slideElement.value?.innerHTML) {
        //     const doc = parser.parseFromString(slideElement.value?.innerHTML, 'text/html')
        //     const img = doc.querySelector('img')
        //     if (!img) return 0;
    
            
        //     const imageWidth = _image.width || img.width;
        //     const imageHeight = _image.height || img.height; 
        // }
        const ratioInfo = getAspectRatio(props.slide)
        // console.log("🚀 ~ file: Slide.vue ~ line 81 ~ onMounted ~ ratioInfo", ratioInfo)
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
    // console.log("width", width.value)
}

function setWidthManualy(val: number) {
    width.value = val
}

function setTransform() {
    // console.log(this)
    if (slideElement.value) {
        // slideElement.value.style.transform = `translateX(${props.sliderWidth * -props.activeIndex}px)`
        // slideElement.value
        // console.log("🚀 ~ file: Slide.vue ~ line 79 ~ setTransform ~ slideElement.value", slideElement.value.style)
        // console.log(slideElement.value.style.transform)
        // slideElement.value.style.transform += ` scale(1.1)`
        // transformText.value = slideElement.value.style.transform + ` scale(1.1)`
        // console.log(slideElement.value.style.transform)

    }
}

defineExpose({
    width,
    setWidth,
    setTransform
})

</script>