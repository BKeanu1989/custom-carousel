<template>
    <div class="sw-flex sw-flex-row sw-justify-center gallery-preview-slide sw-gap-2 sw-mb-10" v-if="images">
      <template v-for="(photo, index) in images" :key="index">
          <div class="wrapper sw-relative hover:sw-cursor-pointer" 
          :class="{'sw-bg-gold sw-bg-opacity-50 sw-z-10': index === currentIndex}" 
          @click="$emit('updateSlide', index)" 
          v-html="photo">
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
}) 
</script>