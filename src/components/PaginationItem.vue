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
import { getAspectRatio } from '../utils/misc';
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
        addImageOverlay()
    } else {
        removeImageOverlay()
    }
})


const computedStyle = computed(() => {
    return {
        // TODO: maybe need to remove it. or add it again in case of x amount of images
        'aspect-ratio': `${imageWidth.value} / ${imageHeight.value}`
    }
})



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
    height: 80px;
}
</style>