<template>
    <div class="cc-flex cc-flex-row cc-justify-center gallery-preview-slide cc-gap-2 cc-mb-10" v-if="images">
      <template v-for="(photo, index) in images" :key="index">
          <div class="wrapper cc-relative hover:cc-cursor-pointer" 
          :class="{'cc-bg-gold cc-bg-opacity-50 cc-z-10': index === currentIndex}" 
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