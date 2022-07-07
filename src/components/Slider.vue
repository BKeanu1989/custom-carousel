<template>
    <div class="custom-carousel cc-flex cc-relative cc-w-f cc-overflow-x-hidden" ref="root">
        <!-- <slot name="navigation"> -->
            <Navigation @prev="prev" @next="next" />
        <!-- </slot> -->
        <div class="custom-carousel--inner" ref="innerTrack">
              <slot>
                  <Slide v-for="(slide, index) in slides" :key="index" 
                      :slide="slide" 
                      :sliderWidth="sliderWidth" 
                      class="cc-slide" 
                      :rootMounted="rootMounted" 
                      :toShow="props.toShow"
                      :imageToShowCombinedWidth="combinedWidth"
                      :style="{}"
                      :class="{active: index === activeIndex, inActive: index !== activeIndex}"
                      ref="slideRefs"
                      >
                  </Slide>
              </slot>
        </div>
        <div>
          {{ activeIndex }}
          {{ breakPoints }}
          {{ test }}
        </div>
        <slot name="pagination">

        </slot>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import Slide from './Slide.vue'
import Navigation from './Navigation.vue';
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
    toShow: {
        type: Number,
        required: true,
    },
    breakPoints: {
      type: Array as PropType<BreakPoint[]>,
      required: true
    }
})

function prev() {
  _loop.value.previous({duration: 0.8, ease: 'power1.inOut'})

}

function next() {
  _loop.value.next({duration: 0.8, ease: 'power1.inOut'})
}

function resetLoop() {
  console.log("reset loop")
  activeIndex.value = 0
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

        // MAYBE: get container width instead of window width
        const toShow = getBreakPointWidth(window.innerWidth, props.breakPoints)
        console.log("🚀 ~ file: Slider.vue ~ line 90 ~ onMounted ~ toShow", toShow)
        const slidesToShowWidth = props.slides.slice(0, toShow)

        combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
            return acc + getWidthOfImage(slide)
        }, 0)

        // setLefts()
        rootMounted.value = true
    }

    setTimeout(() => {
      const boxes = gsap.utils.toArray('.cc-slide')
      const callBackOptions = {
        aniEnd: (index) => {
          activeIndex.value = index
        },
        onComplete: () => {
          console.log("onComplete")
        },
        onReset: () => {
          resetLoop()
        }
      }
      _loop.value = horizontalLoop(boxes, {paused: true, draggable: true},
      callBackOptions)
      ,
      boxes.forEach((box, i) => box.addEventListener("click", () => _loop.value.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));
    }, 50);


})
</script>

<style>
.custom-carousel--inner {
  /* height: 20%; */
  /* width: 60%; */
  /* background: #555; */
  position: relative;
  display: flex;
  align-items: center;
  /* overflow: hidden; */
}


.cc-slide {
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

.cc-slide.active {
  transform: scale(1.1);
}

.cc-slide.inActive {
  filter: opacity(.7)
}

</style>