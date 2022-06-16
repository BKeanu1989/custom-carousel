<template>
    <div v-html="slide" :width="width" class="cc-h-full"></div>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue';


const props = defineProps({
    slide: {
        type: String as PropType<string>,
        required: true,
    },
    width: {
        type: Number,
        required: true
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
    }
})

const width = ref(0)

watch(() => props.rootMounted,(val) => {
    if (val) {
        width.value = getWidthForSlide(props.slide)
    }
})

/**
 * 
 * @param slide HTMLImageElement
 */
function getWidthForSlide(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth

    // console.log("🚀 ~ file: Slide.vue ~ line 50 ~ getWidthForSlide ~ imageWidth", imageWidth)
    // const imageHeight = img.height
    // const ratio = imageWidth / imageHeight

    // // console.log("🚀 ~ file: Slide.vue ~ line 53 ~ getWidthForSlide ~ ratio", ratio)
    // return (imageWidth) / props.sliderWidth 

    // return ratio
}

defineExpose({
    width,
})

onMounted(() => {
  width.value = getWidthForSlide(props.slide)  
})


</script>