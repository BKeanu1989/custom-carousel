<template>
  <div
    class="sw-carousel--pagination sw-flex sw-flex-row sw-flex-wrap sw-justify-center gallery-preview-slide sw-mb-10 sw-gap-[2.2px] sw-mt-[2px]"
    v-if="images"
  >
    <template v-for="(photo, index) in images" :key="index">
      <PaginationItem
        :item="photo"
        :index="index"
        :currentIndex="injectedActive"
        @click="$emit('updateSlide', index)"
      ></PaginationItem>
    </template>
  </div>
</template>
<script setup lang="ts">
import { inject, PropType } from "vue";
import PaginationItem from "./PaginationItem.vue";

const injectedActive = inject("slideActiveIndex", 0);
const props = defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true,
  },
  // currentIndex: {
  //   type: Number as PropType<number>,
  //   default: 0,
  // },
  activeStyle: {
    type: Object as PropType<object>,
    default: () => ({}),
  },
});
const emits = defineEmits(["updateSlide"]);
</script>
<style>
.v-html-photo,
.v-html-photo img {
  height: 100%;
}
</style>
