<template>
    <!-- <div v-html="item" class="pagination--item" :style="computedStyle"></div> -->
    <div class="wrapper sw-relative pagination--item sw-min-w-[50px] hover:sw-cursor-pointer" 
        :style="computedStyle"
        @click="$emit('updateSlide', index)" 
        >
        <div v-html="item" class="v-html-item sw-relative" ref="html_image" :id="'pagination-html-' + index"></div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch} from 'vue';
const html_image = ref<HTMLElement | null>(null)
const props = defineProps({
    item: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: false
    },
    currentIndex: {
        type: Number,
        default: 0,
    },
})
const imageWidth = ref(0)
const imageHeight = ref(0)

onMounted(() => {
    const ratioInfo = getAspectRatio(props.item)
    if (ratioInfo) {
        imageWidth.value = ratioInfo.width
        imageHeight.value = ratioInfo.height
    }

})


watch(() => props.currentIndex,(newVal, oldVal) => {
    if (newVal === props.index) {
        console.log("current index changed to same index", newVal)
        addImageOverlay()
    } else {
        removeImageOverlay()
    }
})


const computedStyle = computed(() => {
    return {
        'aspect-ratio': `${imageWidth.value} / ${imageHeight.value}`,
    }
})

interface RatioInfo {
    aspectRatio: string,
    width: number,
    height: number,
}
function getAspectRatio(item: string) :RatioInfo | null {
    const parser = new DOMParser()
    const doc = parser.parseFromString(item, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return null;

    const imageWidth = img.width
    const imageHeight = img.height

    return {
        'aspectRatio': `${imageWidth} / ${imageHeight}`,
        'height': imageHeight,
        'width': imageWidth,
    }
}

function addImageOverlay() {
    const _template = `<div class="sw-absolute sw-w-full sw-h-full sw-top-0 sw-bg-gold sw-bg-opacity-50 sw-z-10" id="imageOverlay-${props.index}"></div>`
    const element = document.querySelector(`#pagination-html-${props.index}`)
    if (element) {
        element.insertAdjacentHTML('beforeend', _template)
    }
}

function removeImageOverlay() {
    const imageOverlay = document.getElementById(`imageOverlay-${props.index}`)
    if (imageOverlay) {
        imageOverlay.remove()
    }
}

</script>
<style>
.pagination--item {
    width: auto;
    height: 150px;
}
</style>