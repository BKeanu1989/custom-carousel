<template>
    <div class="custom-carousel cc-flex cc-relative cc-w-f cc-overflow-x-hidden" ref="root">
        
        <!-- <slot name="navigation"> -->
            <Navigation @prev="prev" @next="next" />
        <!-- </slot> -->
        <div class="custom-carousel--inner cc-transition-all" ref="innerTrack">
            <slot>
                <Slide v-for="(slide, index) in slides" :key="index" 
                    :slide="slide" 
                    :sliderWidth="sliderWidth" 
                    class="" 
                    :rootMounted="rootMounted" 
                    :toShow="props.toShow"
                    :imageToShowCombinedWidth="combinedWidth"
                    :style="{}"
                    ref="slideRefs"
                    >
                </Slide>
            </slot>
        </div>
        <slot name="pagination">

        </slot>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import Slide from './Slide.vue'
import Navigation from './Navigation.vue'

const root = ref<HTMLElement | null>(null)
const innerTrack = ref<HTMLElement | null>(null)

const rootMounted = ref(false)
const sliderWidth = ref(0)
const widthsOfSlides = ref<number[]>([])

const slideRefs = ref([])
const combinedWidth = ref(0)
const activeIndex = ref(0)
const activeSlide = computed(() => {

    return slideRefs.value[activeIndex.value]
})

const activeSlideWidth = computed(() => {
    return activeSlide.value.width
})

const prevSlide = computed(() => {
    return slideRefs.value[activeIndex.value - 1]
})

const nextSlide = computed(() => {
    
    return slideRefs.value[activeIndex.value + 1]
})
// const prevSlide = ref

watch(activeIndex, (newVal) => {
  updateSlide(newVal)
})

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

function updateSlide(index: number) {
    if (index === 0) {
        innerTrack.value!.style.transform = `translateX(0px)`
        return
    }

    const slidesWidth = slideRefs.value.splice(0, index).reduce((acc, slide) => {
        return acc + slide.width
    }, 0)

    innerTrack.value!.style.transform = `translateX(-${slidesWidth}px)`
}

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

function prev() {
    if (activeIndex.value === 0) {
        activeIndex.value = props.slides.length - 1
        return
    }

    activeIndex.value--
}

function next() {
    if (activeIndex.value === props.slides.length - 1) {
        activeIndex.value = 0
        return
    }

    activeIndex.value++
}


defineExpose({
    slideRefs,
    activeSlide,
    prev,
    next
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