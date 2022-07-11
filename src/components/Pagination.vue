<template>
    <div class="sw-flex sw-flex-row sw-justify-center gallery-preview-slide sw-gap-2 sw-mb-10 sw-max-h-36" v-if="images">
      <template v-for="(photo, index) in images" :key="index">
        <PaginationItem :item="photo" :index="index" :currentIndex="currentIndex"></PaginationItem>
      </template>
    </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import PaginationItem from './PaginationItem.vue';

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