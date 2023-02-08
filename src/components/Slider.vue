<template>
  <div>
    <!-- class="sw-carousel sw-flex sw-relative sw-w-f sw-overflow-x-hidden sw-overflow-y-hidden" -->
    <div
      class="sw-carousel sw-flex sw-relative sw-w-f sw-overflow-x-hidden"
      :class="rootClasses"
      ref="root"
      :style="computedStyle"
      :data-active="activeIndex"
    >
      <!-- <slot name="navigation"> -->
      <Navigation @prev="onPrev" @next="onNext"></Navigation>
      <!-- class="sw-carousel--inner sw-max-h-[600px] sw-w-full" -->
      <!-- </slot> -->
      <!-- {{ cleanedSlides }} -->
      <div
        class="sw-carousel--inner sw-max-h-[600px] sw-w-full"
        ref="innerTrack"
      >
        <slot>
          <Slide
            v-for="(slide, index) in cleanedSlides"
            :key="index"
            :slide="slide"
            :sliderWidth="sliderWidth"
            class="sw-slide2"
            :rootMounted="rootMounted"
            :imageToShowCombinedWidth="combinedWidth"
            :parseCredits="true"
            :style="{}"
            :class="{
              inActive: index !== activeIndex,
              'sw-z-10': index === activeIndex,
            }"
            :active="index === activeIndex"
            :id="index"
            ref="slideRefs"
            @slide-to-index="gsapToIndex($event)"
          >
          </Slide>
        </slot>
        <slot name="indicator">
          <PaginationIndicator
            :items="cleanedSlides"
            @slide-to-index="($event) => gsapToIndex($event)"
          ></PaginationIndicator>
        </slot>
      </div>
    </div>
    <slot name="pagination" v-if="showPagination">
      <Pagination
        :images="cleanedSlides"
        @updateSlide="gsapToIndex($event)"
      ></Pagination>
    </slot>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
  readonly,
  provide,
  reactive,
  inject,
} from "vue";
import { useDrag } from "@vueuse/gesture";
import { useEventListener } from "@vueuse/core";

import Slide from "./Slide.vue";
import Navigation from "./Navigation.vue";
import Pagination from "./Pagination.vue";
import PaginationIndicator from "./PaginationIndicator.vue";

import gsap from "gsap";

import { type BreakPoint } from "../types/BreakPoints";
import { horizontalLoop3 } from "../utils/gsapUtils";
import { getWidthOfImage, getBreakPointWidth } from "../utils/misc";
import { type SlideEvent } from "../types/index";
import {
  containerHeightKey,
  aspectRatioSupportedKey,
} from "../utils/symbolKeys";
const root = ref<HTMLElement | null>(null);
const innerTrack = ref<HTMLElement | null>(null);

const rootMounted = ref(false);
const sliderWidth = ref(0);
const widthsOfSlides = ref<number[]>([]);
const _loop = ref<any>(null);
const aspectRatioSupported = ref(true);
const slideRefs = ref([]);
const totalSlides = computed(() => slideRefs.value.length);
const combinedWidth = ref(0);

const cleanedSlides = computed(() => {
  return props.slides.filter((htmlString) => {
    return !!htmlString;
  });
});

useEventListener(document, "keydown", (e) => {
  if (e.key === "ArrowLeft")
    _loop.value.previous({ duration: props.slideTimer, ease: "power1.inOut" });
  if (e.key === "ArrowRight")
    _loop.value.next({ duration: props.slideTimer, ease: "power1.inOut" });
});

const activeIndex = ref(0);
const tmp_prev = computed(() => {});
const tmp_next = computed(() => {});
const containerHeight = computed(() => {
  if (root.value) {
    if (props.selectorForFullHeight) {
      const element = document.querySelector(
        props.selectorForFullHeight
      ) as HTMLElement;
      if (!element) return 0;
      return element.offsetHeight;
    } else {
      return props.height;
    }
  }
  return 0;
});
provide(containerHeightKey, containerHeight);

const computedStyle = computed(() => {
  const styles = {
    height: "",
  };
  styles.height = `${containerHeight.value}px`;

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
    required: false,
  },
  slideTimer: {
    type: Number,
    required: false,
    default: 0.5,
  },
});

provide("slideStyles", props.slideStyles);
provide("slideClasses", props.slideClasses);
provide("creditStyles", props.creditStyles);
provide("totalSlides", totalSlides);
provide("slideActiveIndex", readonly(activeIndex));
provide("slideRefs", readonly(slideRefs));
// provide("aspectRatioSupported", readonly(aspectRatioSupported));
provide(aspectRatioSupportedKey, aspectRatioSupported);

const state = reactive({
  sliderActiveIndex: readonly(activeIndex),
});

const rootClasses = computed(() => {
  return {
    "scrollbar-none": !aspectRatioSupported.value,
    "sw-overflow-y-hidden": !aspectRatioSupported.value,
  };
});

provide("sliderState", state);

function gsapToIndex(index: number) {
  if (Number.isNaN(index)) return;
  _loop.value.toIndex(index, {
    duration: props.slideTimer,
    ease: "power1.inOut",
  });
}

function onPrev() {
  _loop.value.previous({ duration: props.slideTimer, ease: "power1.inOut" });
}

function onNext() {
  _loop.value.next({ duration: props.slideTimer, ease: "power1.inOut" });
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
  onPrev,
  onNext,
});

onMounted(() => {
  if (!CSS.supports("aspect-ratio", "16/9")) {
    console.log("aspect ratio is not supported");
    aspectRatioSupported.value = false;
  }
  if (innerTrack.value) {
    if (!aspectRatioSupported.value) {
      innerTrack.value.style.display = "block ruby";
    }
  }
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
      onComplete: (_old: number, _newV: number) => {},
      onCompleteSecond: (_old: any, _newV: any) => {
        // @ts-ignore
        slideRefs.value[activeIndex.value].setTransform();
        // slideRefs.value[newV].setTransform()
      },
      onReset: () => {
        resetLoop();
      },
    };
    let activeElement: any;
    _loop.value = horizontalLoop3(boxes, {
      paused: true,
      draggable: true, // make it draggable
      center: true, // active element is the one in the center of the container rather than th left edge
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

    try {
      activeIndex.value = 0;
      _loop.value.toIndex(activeIndex.value, {
        duration: props.slideTimer,
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

const dragHandler_v2 = <
  T extends { movement: any; dragging: any; event: SlideEvent }
>({
  movement: [x, y],
  dragging,
  event,
}: T) => {
  if (!dragging) {
    if (x === 0) {
      const dataKey = parseInt(event.target?.dataset.key);
      if (dataKey !== undefined) {
        if (dataKey === _loop.value.current()) return;
        gsapToIndex(dataKey);
      }
      return;
    }
    const direction = x > 0 ? "left" : "right";
    if (direction === "left") {
      _loop.value.previous({
        duration: props.slideTimer,
        ease: "power1.inOut",
      });
    } else {
      _loop.value.next({ duration: props.slideTimer, ease: "power1.inOut" });
    }
  }
};

// @ts-ignore
useDrag(dragHandler_v2, {
  domTarget: innerTrack,
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

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
