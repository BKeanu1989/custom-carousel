<template>
    <div class="sw-flex sw-flex-row sw-justify-center gallery-preview-slide sw-gap-2 sw-mb-10 sw-max-h-48" v-if="images">
      <template v-for="(photo, index) in images" :key="index">
          <div class="wrapper sw-relative hover:sw-cursor-pointer" 
          :class="{'sw-bg-gold sw-bg-opacity-50 sw-z-10': index === currentIndex}" 
          @click="$emit('updateSlide', index)" 
          >
            <div v-html="photo" class="v-html-photo"></div>
            <div class="sw-absolute sw-w-full sw-h-full sw-top-0" :class="{'sw-bg-gold sw-bg-opacity-50 sw-z-10': index === currentIndex}"></div>

          </div>
      </template>
    </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
    images: {
        type: Array as PropType<string[]>,
        required: true,
    },
    currentIndex: {
        type: Number as PropType<number>,
        default: 0,
    },
    activeStyle: {
        type: Object as PropType<object>,
        default: () => ({}),
    },
}) 
</script>
<style>
.v-html-photo, .v-html-photo img {
    height: 100%;
}
</style>