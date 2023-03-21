<template>
  <div
    v-html="slide"
    class="sw-h-full sw-carousel sw-relative sw-cursor-pointer sw-select-none"
    :class="injectedStyleClasses"
    :style="computedStyle"
    :data-key="props.id"
    :data-near="slideIsCloseToActive ? 'yes' : 'no'"
    ref="slideElement"
    @contextmenu.native="handler"
  ></div>
</template>
<script setup lang="ts">
import { getAspectRatio, getPhotographerCredits } from "../utils/misc";
import {
  computed,
  onMounted,
  onUnmounted,
  PropType,
  unref,
  ref,
  watch,
  inject,
  Ref,
} from "vue";

import { isClose } from "../utils/misc";
import {
  aspectRatioSupportedKey,
  containerHeightKey,
} from "../utils/symbolKeys";

const handler = (e: MouseEvent) => {
  console.log(e, $img.value);
};

const slideElement = ref<HTMLElement | null>(null);
const $img = ref<HTMLElement | null>(null);

const injectedStyleClasses = inject<string[]>("slideClasses", [""]);
const injectedContainerHeight = inject(containerHeightKey, ref(0));
const injectedAspectRatio = inject<Ref<boolean>>(
  aspectRatioSupportedKey,
  ref(true)
);
const computedStyleClasses = computed(() => {
  if (!injectedStyleClasses) return [];
  const _cp = [...injectedStyleClasses];
  if (slideIsCloseToActive) _cp.push("near");
  return;
});
const injectedCreditStyles = inject("creditStyles", "");
const injectedActive = inject<number | null>("slideActiveIndex", 0);
// const injectedTotalSlides = inject(" slideTotalSlides", null);
const injectedSlides = inject<[]>("slideRefs", []);

const emits = defineEmits(["slideToIndex"]);

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  slide: {
    type: String as PropType<string>,
    required: true,
  },
  sliderWidth: {
    type: Number,
    required: true,
  },
  rootMounted: {
    type: Boolean,
    required: true,
  },
  imageToShowCombinedWidth: {
    type: Number,
    required: true,
  },
  parseCredits: {
    type: Boolean,
    required: false,
    default: false,
  },
  id: {
    type: Number,
    required: true,
  },
});

const transformText = ref("");
const width = ref(0);
const imageHeight = ref(0);
const imageWidth = ref(0);
const credits = ref("");
const slideIsCloseToActive = computed(() => {
  // console.log("🚀 ~ ", injectedSlides.value, props.id, injectedActive.value);

  if (!injectedSlides) return;
  if (!injectedActive) return;
  const test = isClose(unref(injectedSlides), props.id, unref(injectedActive));
  return test;
});
watch(
  () => [props.rootMounted, props.imageToShowCombinedWidth],
  (val) => {
    if (val) {
      setWidth();
    }
  }
);

watch(
  () => props.active,
  (val) => {
    if (val) {
      appendCredits();
    } else {
      removeCredits();
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => slideIsCloseToActive,
  (val) => {}
);

// watch(
//   () => injectedAspectRatio,
//   (newVal, oldVal) => {
//     // aka not supported
//     if (!newVal.value) {
//       console.log("new val: aspect " + newVal.value, oldVal);
//     }
//   },
//   {
//     deep: true,
//   }
// );

const calcSemiAspectRatioWidth = () => {
  const _imageHeight = imageHeight.value;
  const _imageWidth = imageWidth.value;
  const divisor = injectedContainerHeight.value / _imageHeight;
  return _imageWidth * divisor;
};

const computedStyle = computed(() => {
  // console.log("injected aspect ratio", injectedAspectRatio.value);
  return {
    "aspect-ratio": `${imageWidth.value} / ${imageHeight.value}`,
    "--aspect-ratio": `${imageWidth.value} / ${imageHeight.value}`,
    "z-index": slideIsCloseToActive.value ? 10 : -10,
    width: injectedAspectRatio.value ? "" : `${calcSemiAspectRatioWidth()}px`,
    "--width": injectedAspectRatio.value
      ? ""
      : `${calcSemiAspectRatioWidth()}px`,
    // "--width": `${width.value}px`,
    // 'transform': transformText.value,
  };
});

// /**
//  *
//  * @param slide HTMLImageElement
//  */
function getWidthForSlide(slide: string, combinedWidth: number): number {
  const parser = new DOMParser();
  const doc = parser.parseFromString(slide, "text/html");
  const img = doc.querySelector("img");
  if (!img) return 0;

  const imageWidth = (img.width / combinedWidth) * props.sliderWidth;

  return imageWidth;
}

onMounted(() => {
  const _image = slideElement.value?.querySelector("img");
  console.log("🚀 ~ file: Slide.vue:183 ~ onMounted ~ _image:", _image);
  if (_image) $img.value = _image;
  if (props.parseCredits) {
    credits.value = getPhotographerCredits(props.slide);
    // console.log("should set", props.slide, credits.value);
  }
  if (_image) {
    const ratioInfo = getAspectRatio(props.slide);
    if (ratioInfo) {
      imageWidth.value = ratioInfo.width;
      imageHeight.value = ratioInfo.height;
    }
  }
  //   if (slideElement.value) {
  //     slideElement.value.addEventListener("click", () => {
  //       console.log(props.id);
  //       emits("slideToIndex", props.id);
  //     });
  //   }
});

onUnmounted(() => {
  // window.removeEventListener('resize', setWidth)
});

function setWidth() {
  width.value = getWidthForSlide(props.slide, props.imageToShowCombinedWidth);
}

function appendCredits() {
  if (!props.parseCredits) return;

  function insertDiv() {
    if (!slideElement.value) return;
    const creditsElement = document.createElement("div");
    creditsElement.id = `credits-${props.id}`;
    const classesToAdd = [
      "sw-carousel--credits",
      "sw-absolute",
      "sw-top-0",
      "sw-left-1",
    ];
    classesToAdd.forEach((className) => {
      creditsElement.classList.add(className);
    });
    let stringStyle = JSON.stringify(injectedCreditStyles);
    creditsElement.setAttribute("style", injectedCreditStyles);
    creditsElement.innerText = credits.value ? `©${credits.value}` : "";
    slideElement.value.appendChild(creditsElement);
  }

  if (slideElement.value) {
    insertDiv();
  }
  // if (!document.querySelector(`#credits-${props.id}`)) {
  else {
    setTimeout(() => {
      insertDiv();
    }, 500);
  }
}

function removeCredits() {
  if (!props.parseCredits) return;

  if (slideElement.value) {
    const creditsElement = slideElement.value.querySelector(
      `#credits-${props.id}`
    );
    if (creditsElement) {
      creditsElement.remove();
    }
  }
}

function setWidthManualy(val: number) {
  width.value = val;
}

function setTransform() {
  if (slideElement.value) {
  }
}

defineExpose({
  width,
  setWidth,
  setTransform,
});
</script>
