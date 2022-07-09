<template>
  <div>
    <div class="sw-carousel sw-flex sw-relative sw-w-f sw-overflow-x-hidden" ref="root">
        <!-- <slot name="navigation"> -->
            <Navigation @prev="prev" @next="next" />
        <!-- </slot> -->
        <div class="sw-carousel--inner" ref="innerTrack">
              <slot>
                  <Slide v-for="(slide, index) in slides" :key="index" 
                      :slide="slide" 
                      :sliderWidth="sliderWidth" 
                      class="sw-slide" 
                      :rootMounted="rootMounted" 
                      :imageToShowCombinedWidth="combinedWidth"
                      :style="{}"
                      :class="{inActive: index !== activeIndex, 'sw-z-10': index === activeIndex}"
                      ref="slideRefs"
                      >
                  </Slide>
              </slot>
        </div>
    </div>
        <slot name="pagination">
          <Pagination :images="slides" :currentIndex="activeIndex" @updateSlide="gsapToIndex($event)"/>
        </slot>

  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import Slide from './Slide.vue'
import Navigation from './Navigation.vue';
import Pagination from './Pagination.vue';
import gsap from 'gsap';

import { type BreakPoint } from '../types/BreakPoints';
import { horizontalLoop } from '../utils/gsapUtils';
import { getWidthOfImage, getBreakPointWidth } from '../utils/misc';

const root = ref<HTMLElement | null>(null)
const innerTrack = ref<HTMLElement | null>(null)

const rootMounted = ref(false)
const sliderWidth = ref(0)
const widthsOfSlides = ref<number[]>([])
const _loop = ref<any>(null)

const slideRefs = ref([])
const combinedWidth = ref(0)
const activeIndex = ref(0)

const test = computed(() => {
  return _loop.value?.current || null;
})

const props = defineProps({
    slides: {
        type: Array as PropType<string[]>,
        required: true,
    },
    breakPoints: {
      type: Object as PropType<BreakPoint>,
      required: true
    }
})

function gsapToIndex(index: number) {
  _loop.value.toIndex(index, {duration: 0.8, ease: 'power1.inOut'})
}

function prev() {
  _loop.value.previous({duration: 0.8, ease: 'power1.inOut'})

}

function next() {
  _loop.value.next({duration: 0.8, ease: 'power1.inOut'})
}

function resetLoop() {
  activeIndex.value = 0
}

function setImagesDependingOnWidth() {
  // MAYBE: get container width instead of window width
  const toShow = getBreakPointWidth(window.innerWidth, props.breakPoints)
  const slidesToShowWidth = props.slides.slice(0, toShow)

  combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
      return acc + getWidthOfImage(slide)
  }, 0)

  // console.log(slideRefs.value)
  // slideRefs.value.forEach((slide, index) => {
  //   console.log("🚀 ~ file: Slider.vue ~ line 100 ~ slideRefs.value.forEach ~ slide", slide)
  //   slide.setWidth()
  // })
}

defineExpose({
    slideRefs,
    prev,
    next
})

onMounted(() => {
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        sliderWidth.value = rect.width

        window.addEventListener('resize', setImagesDependingOnWidth)
        setImagesDependingOnWidth()
        // setLefts()
        rootMounted.value = true
    }

    setTimeout(() => {
      const boxes = gsap.utils.toArray('.sw-slide')
      const callBackOptions = {
        aniEnd: (index: number) => {
          activeIndex.value = index
        },
        onComplete: (old: number, newV: number) => {
          // slideRefs.value[newV].setTransform()
        },
        onCompleteSecond: (old: any, newV: any) => {
          // @ts-ignore
          slideRefs.value[activeIndex.value].setTransform()
          // slideRefs.value[newV].setTransform()
        },
        onReset: () => {
          resetLoop()
        }
      }
      _loop.value = horizontalLoop(boxes, {paused: true, draggable: true},
      callBackOptions)
      ,
      boxes.forEach((box: any, i: number) => box.addEventListener("click", () => _loop.value.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));
    }, 50);


})

onUnmounted(() => {
  window.removeEventListener('resize', setImagesDependingOnWidth)
})
</script>

<style>
.sw-carousel--inner {
  /* height: 20%; */
  /* width: 60%; */
  /* background: #555; */
  position: relative;
  display: flex;
  align-items: center;
  /* overflow: hidden; */
}


.sw-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: green; */
  height: 80%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  flex-shrink: 0;
  color: black;
  font-size: 21px;
  cursor: pointer;
}

.sw-slide.active {
  transform: scale(1.1);
}

.sw-slide.inActive {
  filter: opacity(.7)
}

</style>