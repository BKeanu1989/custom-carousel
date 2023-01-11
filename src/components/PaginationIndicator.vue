<template>
  <div
    class="pagination--indicator sw-absolute sw-bottom-5 sw-z-10 sw-flex sw-gap-4"
    ref="_root"
    :style="computedStyle"
  >
    <template v-for="(single, index) in items" :key="index">
      <div
        class="sw-w-1 sw-h-1 sw-rounded-full sw-bg-white sw-cursor-pointer pagination--indicator-single sw-relative"
        :class="{ active: injectedActive === index }"
        @click="emits('slideToIndex', index)"
      ></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, PropType, inject } from "vue";

const injectedActive = inject("slideActiveIndex", 0);
const emits = defineEmits(["slideToIndex"]);
const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
  },
});
const _root = ref<HTMLElement | null>(null);
const left = ref(0);

const computedStyle = computed(() => {
  return {
    left: left.value + "px",
    // 'border':
  };
});

const computedClass = computed(() => {
  return {
    // 'active': props.currentIndex === index,
  };
});

defineExpose({
  setLeft,
  _root,
});

function setLeft(value: number) {
  left.value = value;
}

onMounted(() => {
  const viewPortWidth = window.innerWidth;
  const test = document.querySelector(".sw-carousel--inner");
  if (_root.value && test) {
    const half = test.offsetWidth / 2 - _root.value.clientWidth / 2;
    setLeft(half);
  }
});
</script>

<style>
.pagination--indicator-single::after {
  content: " ";
  z-index: -10;
  border: 1px solid transparent;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  left: -5px;
  bottom: -5px;
  right: -5px;
}

.pagination--indicator-single.active::after {
  border: 1px solid white;
}
</style>
