<template>
  <div ref="target" id="context-menu" class="sw-w-fit sw-z-50">
    <button
      type="button"
      class="sw-py-2 sw-px-5 sw-text-white"
      @click="injectedDownload()"
    >
      Bild speichern
    </button>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const target = ref<HTMLElement | null>(null);
const injectedSetShow = inject("context-menu-set-show", (e: boolean) =>
  console.log("default set show")
);
const injectedImgUrl = inject("context-menu-img-url", "");
onClickOutside(target, () => {
  injectedSetShow(false);
});
const injectedDownload = inject("context-menu-download", () =>
  console.log("default context download")
);
const injectedX = inject("context-menu-mouse-pos-x", ref(0));
const injectedY = inject("context-menu-mouse-pos-y", ref(0));

const xPos = computed(() => {
  console.log(target.value);
  let minus = 0;
  if (target.value) {
    const vals = target.value.getBoundingClientRect();
    minus = vals.width / 2;
  }
  return injectedX.value - minus + "px";
});

const yPos = computed(() => {
  let minus = 0;
  if (target.value) {
    const vals = target.value.getBoundingClientRect();
    minus = vals.height * 0.875;
  }
  return injectedY.value - minus - window.scrollY + "px";
});
</script>
<style scoped>
#context-menu {
  background-color: #326e7b;
  position: fixed;
  left: v-bind(xPos);
  top: v-bind(yPos);
}

#context-menu:hover {
  background-color: #27525c;
}
</style>
