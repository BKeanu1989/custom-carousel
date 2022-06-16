<template>
    <div class="carousel cc-flex cc-w-full" ref="root">
        
        <slot name="navigation">

        </slot>
        <slot>
            <Slide v-for="(slide, index) in slides" :key="index" 
                :slide="slide" class="" :width="getWidthForSlide(slide)">
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
const props = defineProps({
    slides: {
        type: Array as PropType<HTMLElement[]>,
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

/**
 * 
 * @param slide HTMLImageElement
 */
function getWidthForSlide(slide: HTMLElement) :number {
    console.log(slide, props.toShow)

    return 0
}

onMounted(() => {

})
</script>