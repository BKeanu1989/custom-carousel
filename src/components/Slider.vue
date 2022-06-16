<template>
    <div class="carousel cc-flex cc-w-f" ref="root">
        
        <slot name="navigation">

        </slot>
        <slot>
            <Slide v-for="(slide, index) in slides" :key="index" 
                :slide="slide" :sliderWidth="sliderWidth" class="" :width="getWidthForSlide(slide)" :rootMounted="rootMounted" :toShow="props.toShow">
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

// function updateSlideWidth() {
//     if (!root.value) return
//     const rect = root.value.getBoundingClientRect()
// }

function getWidthOfImage(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth
}

function getWidthForSlide(slide: string) :number {
    // if ()
    const imageWidth = getWidthOfImage(slide)

    return imageWidth 
}



onMounted(() => {
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        sliderWidth.value = rect.width
        rootMounted.value = true

        const slidesToShowWidth = props.slides.slice(0, props.toShow)
        combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
            return acc + getWidthOfImage(slide)
        }, 0)

    }

})
</script>