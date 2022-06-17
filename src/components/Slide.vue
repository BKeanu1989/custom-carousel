<template>
    <div v-html="slide" :width="width" class="cc-h-full cc-absolute custom-carousel" :style="{width: width + 'px', left: left + 'px'}"></div>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue';


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
    toShow: {
        type: Number,
        required: true
    },
    imageToShowCombinedWidth: {
        type: Number,
        required: true
    },
})

const width = ref(0)
const left = ref(0)

watch(() => props.rootMounted,(val) => {
    if (val) {
        width.value = getWidthForSlide(props.slide, props.imageToShowCombinedWidth)
    }
})

/**
 * 
 * @param slide HTMLImageElement
 */
function getWidthForSlide(slide: string, combinedWidth: number) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width / combinedWidth * props.sliderWidth

    return imageWidth
}

function setLeftPosition(position) {
    left.value = position
}

defineExpose({
    width,
    setLeftPosition
})

</script>