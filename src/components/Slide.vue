<template>
    <!-- <div class="sw-carousel--slide"> -->
    <div v-html="slide"
        class="sw-h-full sw-carousel sw-relative sw-pointer-events-none sw-select-none sw-cursor-pointer"
        :class="injectedStyleClasses" :style="computedStyle" ref="slideElement"></div>
    <!-- <div v-if="active">
            {{ credits }}
        </div>
    </div> -->
</template>
<script setup lang="ts">
import { getAspectRatio, getPhotographerCredits } from "../utils/misc";
import {
    computed,
    onMounted,
    onUnmounted,
    PropType,
    ref,
    watch,
    inject,
} from "vue";
const slideElement = ref<HTMLElement | null>(null);

const injectedStyleClasses = inject('slideClasses', [])
const injectedCreditStyles = inject('creditStyles', '')

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
    }
);

const computedStyle = computed(() => {
    return {
        "aspect-ratio": `${imageWidth.value} / ${imageHeight.value}`,
        // 'width': `${width.value}px`,
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
    if (props.parseCredits) {
        credits.value = getPhotographerCredits(props.slide);
    }
    if (_image) {
        const ratioInfo = getAspectRatio(props.slide);
        if (ratioInfo) {
            imageWidth.value = ratioInfo.width;
            imageHeight.value = ratioInfo.height;
        }
    }
});

onUnmounted(() => {
    // window.removeEventListener('resize', setWidth)
});

function setWidth() {
    width.value = getWidthForSlide(props.slide, props.imageToShowCombinedWidth);
}

function appendCredits() {
    if (!props.parseCredits) return;

    if (slideElement.value) {
        if (!document.querySelector(`#credits-${props.id}`)) {
            const creditsElement = document.createElement("div");
            creditsElement.id = `credits-${props.id}`;
            const classesToAdd = [
                "sw-carousel--credits",
                "sw-absolute",
                "sw-top-0",
                "sw-left-0",
            ];
            classesToAdd.forEach((className) => {
                creditsElement.classList.add(className);
            });
            let stringStyle = JSON.stringify(injectedCreditStyles)
            // stringStyle = stringStyle.substring(1)
            // stringStyle = stringStyle.slice(0, -1)
            // stringStyle = stringStyle.replace(',', ';')
            // console.log("🚀 ~ file: Slide.vue ~ line 178 ~ appendCredits ~ stringStyle", stringStyle)

            creditsElement.setAttribute('style', injectedCreditStyles)
            // creditsElement.set
            creditsElement.innerText = credits.value ? `©${credits.value}` : "";
            slideElement.value.appendChild(creditsElement);
        }
    }
    // const credits = getPhotographerCredits()
    // if (credits) {
    //     transformText.value = `translateY(-100%)`
    // }
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
