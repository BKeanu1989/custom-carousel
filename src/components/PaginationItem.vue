<template>
    <!-- <div v-html="item" class="pagination--item" :style="computedStyle"></div> -->
    <div class="wrapper sw-relative pagination--item hover:sw-cursor-pointer" 
        :class="{'sw-bg-gold sw-bg-opacity-50 sw-z-10': index === currentIndex}" 
        :style="computedStyle"
        @click="$emit('updateSlide', index)" 
        >
        <div v-html="item" class="v-html-item"></div>
        <div class="sw-absolute sw-w-full sw-h-full sw-top-0" :class="{'sw-bg-gold sw-bg-opacity-50 sw-z-10': index === currentIndex}"></div>

    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted} from 'vue';

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
    console.log("🚀 ~ file: PaginationItem.vue ~ line 18 ~ onMounted ~ ratioInfo", ratioInfo)
    if (ratioInfo) {
        imageWidth.value = ratioInfo.width
        imageHeight.value = ratioInfo.height
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
</script>
<style>
.pagination--item {
    width: auto;
    height: 150px;
}
</style>