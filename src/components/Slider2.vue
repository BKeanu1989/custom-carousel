<template>
  <div>
    <div class="sw-carousel sw-flex sw-relative sw-w-f sw-overflow-x-hidden" ref="root" :style="computedStyle">
        <!-- <slot name="navigation"> -->
            <Navigation @prev="prev" @next="next"></Navigation>
        <!-- </slot> -->
        <div class="sw-carousel--inner sw-max-h-[365px] sw-w-full"  ref="innerTrack">
              <slot>
                  <Slide v-for="(slide, index) in slides" :key="index" 
                      :slide="slide" 
                      :sliderWidth="sliderWidth" 
                      class="sw-slide2" 
                      :rootMounted="rootMounted" 
                      :imageToShowCombinedWidth="combinedWidth"
                      :style="{}"
                      :class="{inActive: index !== activeIndex, 'sw-z-10': index === activeIndex}"
                      ref="slideRefs"
                      >
                  </Slide>
              </slot>
              <slot name="indicator">
                <PaginationIndicator :items="slides" :currentIndex="activeIndex"></PaginationIndicator>
              </slot>
        </div>
    </div>
        <slot name="pagination">
          <Pagination :images="slides" :currentIndex="activeIndex" @updateSlide="gsapToIndex($event)"></Pagination>
        </slot>

  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import Slide from './Slide.vue'
import Navigation from './Navigation.vue';
import Pagination from './Pagination.vue';
import PaginationIndicator from './PaginationIndicator.vue';

import gsap from 'gsap';

import { type BreakPoint } from '../types/BreakPoints';
import { horizontalLoop2 } from '../utils/gsapUtils';
import { getWidthOfImage, getBreakPointWidth } from '../utils/misc';

const root = ref<HTMLElement | null>(null)
const innerTrack = ref<HTMLElement | null>(null)

const rootMounted = ref(false)
const sliderWidth = ref(0)
const widthsOfSlides = ref<number[]>([])
const _loop = ref<any>(null)

const slideRefs = ref([])
const combinedWidth = ref(0)

// we could make it to a computed property...
const activeIndex = ref(0)

// const activeIndex = computed(() => {
//   return _loop.value?.current() || 0;
// })

const test = computed(() => {
  return _loop.value?.current || null;
})

const computedStyle = computed(() => {
  return {
    'height': `${props.height}px`
  }
})

const props = defineProps({
    slides: {
        type: Array as PropType<string[]>,
        required: true,
    },
    breakPoints: {
      type: Object as PropType<BreakPoint>,
      required: true
    },
    height: {
        type: Number,
        required: false,
        default: 400
    },
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
      const boxes = gsap.utils.toArray('.sw-slide2')
      const callBackOptions = {
        // aniEnd: (index: number) => {
        //   activeIndex.value = index
        // },
        onComplete: (_old: number, _newV: number) => {
          console.log("onComplete", _newV)
          // slideRefs.value[newV].setTransform()
        },
        onCompleteSecond: (_old: any, _newV: any) => {
          console.log("onCompleteSecond")

          // @ts-ignore
          slideRefs.value[activeIndex.value].setTransform()
          // slideRefs.value[newV].setTransform()
        },
        onReset: () => {
          resetLoop()
        }
      }
      let activeElement: any; 
    //   _loop.value = horizontalLoop(boxes, {paused: true, draggable: true, center: true}, callBackOptions)
      _loop.value = horizontalLoop2(boxes, {
        paused: true, 
        draggable: true, // make it draggable
        center: true, // active element is the one in the center of the container rather than th left edge
        onChange: (element: HTMLElement, index: number) => { // when the active element changes, this function gets called.
          console.log(element, index)
          activeElement && activeElement.classList.remove("active");
          element.classList.add("active");
          activeElement = element;
        },
        updateIndex(index: number) {
          activeIndex.value = index
        }
      })
      boxes.forEach((box: any, i: number) => box.addEventListener("click", () => _loop.value.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));

      try {
        activeIndex.value = _loop.value?.current() || 0;
      } catch (error) {
        console.log(error)
      }
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
  /* display: flex;
  align-items: center;
  justify-content: center; */
  /* background: green; */
  /* height: 80%;
  width: 100%; */
  /* margin: 0;
  padding: 0;
  position: relative;
  flex-shrink: 0; */
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