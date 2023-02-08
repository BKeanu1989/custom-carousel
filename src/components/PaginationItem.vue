<template>
  <!-- <div v-html="item" class="pagination--item" :style="computedStyle"></div> -->
  <div
    class="wrapper sw-relative pagination--item sw-min-w-[50px] hover:sw-cursor-pointer"
    :class="{ active: injectedActive == index }"
    :style="computedStyle"
    @click="$emit('updateSlide', index)"
  >
    <div
      v-html="item"
      class="v-html-item sw-relative"
      ref="html_image"
      :id="'pagination-html-' + index"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, inject, reactive, Ref } from "vue";
import { getAspectRatio } from "../utils/misc";
import {
  aspectRatioSupportedKey,
  containerHeightKey,
} from "../utils/symbolKeys";
const injectedAspectRatio = inject<Ref<boolean>>(
  aspectRatioSupportedKey,
  ref(true)
);
const html_image = ref<HTMLElement | null>(null);
const injectedActive = inject("slideActiveIndex", 0);
const injectedState = inject<{ sliderActiveIndex: number } | null>(
  "sliderState",
  null
);
// const reactiveActiveIndex = reactive(injectedActive);
const props = defineProps({
  item: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: false,
  },
});
const imageWidth = ref(0);
const imageHeight = ref(0);
// "container height"
const fixedHeight = ref(80);
const _fixedHeightPx = computed(() => fixedHeight.value + "px");
onMounted(() => {
  const ratioInfo = getAspectRatio(props.item);
  // console.log(injectedActive);
  if (ratioInfo) {
    imageWidth.value = ratioInfo.width;
    imageHeight.value = ratioInfo.height;
  }
});

watch(
  // injectedActive,
  () => injectedState,
  (newVal, oldVal) => {
    if (!newVal) return;
    if (newVal.sliderActiveIndex === props.index) {
      addImageOverlay();
    } else {
      removeImageOverlay();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const calcSemiAspectRatioWidth = () => {
  const _imageHeight = imageHeight.value;
  const _imageWidth = imageWidth.value;
  const divisor = fixedHeight.value / _imageHeight;
  return _imageWidth * divisor;
};

const computedStyle = computed(() => {
  return {
    // TODO: maybe need to remove it. or add it again in case of x amount of images
    "aspect-ratio": `${imageWidth.value} / ${imageHeight.value}`,
    "--aspect-ratio": `${imageWidth.value} / ${imageHeight.value}`,
    // "width":
    width: injectedAspectRatio.value ? "" : `${calcSemiAspectRatioWidth()}px`,
  };
});

let timer: any;
function addImageOverlay() {
  const _template = `<div class="sw-absolute sw-w-full sw-h-full sw-top-0 sw-bg-gold sw-bg-opacity-50 sw-z-10" id="imageOverlay-${props.index}"></div>`;
  const element = document.querySelector(`#pagination-html-${props.index}`);
  if (!element) {
    setTimeout(() => {
      const element = document.querySelector(`#pagination-html-${props.index}`);
      element?.insertAdjacentHTML("beforeend", _template);
    }, 500);
  }
  if (element) {
    element.insertAdjacentHTML("beforeend", _template);
  }
}

function removeImageOverlay() {
  const imageOverlay = document.getElementById(`imageOverlay-${props.index}`);
  if (imageOverlay) {
    imageOverlay.remove();
  }
}
</script>
<style>
.pagination--item {
  width: auto;
  height: v-bind(_fixedHeightPx);
}
</style>
