<template>
    <div class="custom-carousel cc-flex cc-relative cc-w-f" ref="root">
        
        <slot name="navigation">

        </slot>
        <slot>
            <Slide v-for="(slide, index) in slides" :key="index" 
                :slide="slide" 
                :sliderWidth="sliderWidth" 
                class="" 
                :rootMounted="rootMounted" 
                :toShow="props.toShow"
                :imageToShowCombinedWidth="combinedWidth"

                ref="slideRefs"
                >
            </Slide>
        </slot>
        <slot name="pagination">

        </slot>
    </div>
</template>
<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue';
import Slide from './Slide.vue'

const root = ref<HTMLElement | null>(null)
const rootMounted = ref(false)
const sliderWidth = ref(0)
const widthsOfSlides = ref<number[]>([])

const slideRefs = ref([])
const combinedWidth = ref(0)

const props = defineProps({
    slides: {
        type: Array as PropType<string[]>,
        required: true,
    },
    toShow: {
        type: Number,
        required: true,
    }
})

function getWidthOfImage(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth
}

/**
 * 
 * @param slide HTMLImageElement
 */
function getWidthForSlide(slide: string, combinedWidth: number) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width / combinedWidth * sliderWidth.value

    return imageWidth
}

function setLefts() {
    slideRefs.value.forEach((slideRef, index) => {
        const leftPos = getLeft(index)
        slideRef.setLeftPosition(leftPos)
    })
}

function getLeft(index: number) {
    const leftPosition = widthsOfSlides.value.slice(0, index).reduce((acc, cur) => acc + cur, 0)
    
    return leftPosition
}

defineExpose({
    slideRefs
})

onMounted(() => {
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        sliderWidth.value = rect.width

        const slidesToShowWidth = props.slides.slice(0, props.toShow)

        combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
            return acc + getWidthOfImage(slide)
        }, 0)

        widthsOfSlides.value = props.slides.map(slide => getWidthForSlide(slide, combinedWidth.value))
        setLefts()
        rootMounted.value = true
    }
})
</script>