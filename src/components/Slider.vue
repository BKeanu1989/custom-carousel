<template>
  <div>
    <div class="sw-carousel sw-flex sw-relative sw-w-f sw-overflow-x-hidden" ref="root" :style="computedStyle">
      <!-- <slot name="navigation"> -->
      <Navigation @prev="prev" @next="next"></Navigation>
      <!-- </slot> -->
      <div class="sw-carousel--inner sw-max-h-[600px] sw-w-full" ref="innerTrack">
        <slot>
          <Slide v-for="(slide, index) in slides" :key="index" :slide="slide" :sliderWidth="sliderWidth"
            class="sw-slide2" :rootMounted="rootMounted" :imageToShowCombinedWidth="combinedWidth" :parseCredits="true"
            :style="{}" :class="{
              inActive: index !== activeIndex,
              'sw-z-10': index === activeIndex,
            }" :active="index === activeIndex" :id="index" ref="slideRefs">
          </Slide>
        </slot>
        <slot name="indicator">
          <PaginationIndicator :items="slides" :currentIndex="activeIndex"></PaginationIndicator>
        </slot>
      </div>
    </div>
    <slot name="pagination" v-if="showPagination">
      <Pagination :images="slides" :currentIndex="activeIndex" @updateSlide="gsapToIndex($event)"></Pagination>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, PropType, ref, watch, provide } from "vue";
import { useDrag } from "@vueuse/gesture";

import Slide from "./Slide.vue";
import Navigation from "./Navigation.vue";
import Pagination from "./Pagination.vue";
import PaginationIndicator from "./PaginationIndicator.vue";

import gsap from "gsap";

import { type BreakPoint } from "../types/BreakPoints";
import { horizontalLoop2 } from "../utils/gsapUtils";
import { getWidthOfImage, getBreakPointWidth } from "../utils/misc";

const root = ref<HTMLElement | null>(null);
const innerTrack = ref<HTMLElement | null>(null);

const rootMounted = ref(false);
const sliderWidth = ref(0);
const widthsOfSlides = ref<number[]>([]);
const _loop = ref<any>(null);

const slideRefs = ref([]);
const combinedWidth = ref(0);

// we could make it to a computed property...
const activeIndex = ref(0);

const computedStyle = computed(() => {
  const styles = {
    height: "",
  };
  if (root.value) {
    if (props.selectorForFullHeight) {
      const element = document.querySelector(
        props.selectorForFullHeight
      ) as HTMLElement;
      if (!element) return {};
      styles.height = `${element.offsetHeight}px`;
    } else {
      styles.height = `${props.height}px`;
    }
  }

  return styles;
});

const props = defineProps({
  slides: {
    type: Array as PropType<string[]>,
    required: true,
  },
  breakPoints: {
    type: Object as PropType<BreakPoint>,
    required: true,
  },
  height: {
    type: Number,
    required: false,
    default: 400,
  },
  showPagination: {
    type: Boolean,
    required: false,
    default: true,
  },
  selectorForFullHeight: {
    type: String,
    required: false,
  },
  slideStyles: {
    type: Object,
    required: false,
  },
  creditStyles: {
    type: String,
    required: false,
  },
  slideClasses: {
    type: Array,
    required: false
  }
});

provide('slideStyles', props.slideStyles)
provide('slideClasses', props.slideClasses)
provide('creditStyles', props.creditStyles)

function gsapToIndex(index: number) {
  _loop.value.toIndex(index, { duration: 0.8, ease: "power1.inOut" });
}

function prev() {
  _loop.value.previous({ duration: 0.8, ease: "power1.inOut" });
}

function next() {
  _loop.value.next({ duration: 0.8, ease: "power1.inOut" });
}

function resetLoop() {
  activeIndex.value = 0;
}

function setImagesDependingOnWidth() {
  // MAYBE: get container width instead of window width
  const toShow = getBreakPointWidth(window.innerWidth, props.breakPoints);
  const slidesToShowWidth = props.slides.slice(0, toShow);

  combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
    return acc + getWidthOfImage(slide);
  }, 0);
}

defineExpose({
  slideRefs,
  prev,
  next,
});

onMounted(() => {
  if (root.value) {
    const rect = root.value.getBoundingClientRect();
    sliderWidth.value = rect.width;

    window.addEventListener("resize", setImagesDependingOnWidth);
    setImagesDependingOnWidth();
    // setLefts()
    rootMounted.value = true;
  }

  setTimeout(() => {
    const boxes = gsap.utils.toArray(".sw-slide2");
    const callBackOptions = {
      // aniEnd: (index: number) => {
      //   activeIndex.value = index
      // },
      onComplete: (_old: number, _newV: number) => {
        // slideRefs.value[newV].setTransform()
      },
      onCompleteSecond: (_old: any, _newV: any) => {
        // @ts-ignore
        // slideRefs.value[activeIndex.value].setTransform()
        // slideRefs.value[newV].setTransform()
      },
      onReset: () => {
        resetLoop();
      },
    };
    let activeElement: any;
    //   _loop.value = horizontalLoop(boxes, {paused: true, draggable: true, center: true}, callBackOptions)
    _loop.value = horizontalLoop2(boxes, {
      paused: true,
      draggable: true, // make it draggable
      center: false, // active element is the one in the center of the container rather than th left edge
      onChange: (element: HTMLElement, index: number) => {
        // when the active element changes, this function gets called.
        activeElement && activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;
      },
      updateIndex(index: number) {
        activeIndex.value = index;
      },
    });
    boxes.forEach((box: any, i: number) =>
      box.addEventListener("click", () =>
        _loop.value.toIndex(i, { duration: 0.8, ease: "power1.inOut" })
      )
    );

    try {
      activeIndex.value = _loop.value?.current() || 0;
      _loop.value.toIndex(activeIndex.value, {
        duration: 0.8,
        ease: "power1.inOut",
      });
    } catch (error) {
      console.log(error);
    }
  }, 50);
});

onUnmounted(() => {
  window.removeEventListener("resize", setImagesDependingOnWidth);
});

const dragStartPos = ref<number | null>(null);
const dragEndPos = ref<number | null>(null);

function restartDragPos() {
  dragStartPos.value = null;
  dragEndPos.value = null;
}
const dragHandler = (state: any) => {
  console.log("drag handler", state)
  if (dragStartPos.value === null) {
    dragStartPos.value = state.event.offsetX;
  }

  if (state.dragging === false) {
    dragEndPos.value = state.event.offsetX;
  }

  if (dragStartPos.value && dragEndPos.value) {
    const draggingPixels = dragStartPos.value - dragEndPos.value;
    if (draggingPixels !== 0) {
      const carouselDistance = Math.round(draggingPixels / 300);
      if (carouselDistance > 0) {
        for (let index = 0; index < carouselDistance; index++) {
          _loop.value.next({ duration: 0.8, ease: "power1.inOut" });
        }
      } else {
        for (let index = 0; index > carouselDistance; index--) {
          _loop.value.previous({ duration: 0.8, ease: "power1.inOut" });
        }
      }
    }
    restartDragPos();
  }
};

const dragHandler_v2 = <T extends { movement: any, dragging: any }>({ movement: [x, y], dragging }: T) => {
  console.log("drag handler", x, y, dragging)

  if (!dragging) {
    const direction = x > 0 ? 'left' : 'right'
    if (direction === 'left') {
      _loop.value.previous({ duration: 0.8, ease: 'power1.inOut' })
    } else {
      _loop.value.next({ duration: 0.8, ease: 'power1.inOut' })
    }
  }
  // if (dragStartPos.value === null) {
  //   dragStartPos.value = state.event.offsetX;
  // }

  // if (state.dragging === false) {
  //   dragEndPos.value = state.event.offsetX;
  // }

  // if (dragStartPos.value && dragEndPos.value) {
  //   const draggingPixels = dragStartPos.value - dragEndPos.value;
  //   if (draggingPixels !== 0) {
  //     const carouselDistance = Math.round(draggingPixels / 300);
  //     if (carouselDistance > 0) {
  //       for (let index = 0; index < carouselDistance; index++) {
  //         _loop.value.next({ duration: 0.8, ease: "power1.inOut" });
  //       }
  //     } else {
  //       for (let index = 0; index > carouselDistance; index--) {
  //         _loop.value.previous({ duration: 0.8, ease: "power1.inOut" });
  //       }
  //     }
  //   }
  //   restartDragPos();
  // }
};

useDrag(dragHandler_v2, {
  domTarget: root,
  filterTaps: true,
  swipeDistance: "1000",
  axis: "x",
});
</script>
<style>
.sw-carousel--inner {
  position: relative;
  display: flex;
  align-items: center;
}

.sw-slide {
  color: black;
  font-size: 21px;
  cursor: pointer;
}

.sw-slide.active {
  transform: scale(1.1);
}

.sw-slide.inActive,
.sw-slide2.inActive {
  filter: opacity(0.7);
}
</style>
