<template>
    <div v-html="slide" class="cc-h-full"></div>
    {{ slide }}
</template>
<script setup lang="ts">

const props = defineProps({
    slide: {
        type: HTMLElement,
        required: true,
    },
    width: {
        type: Number,
        required: true
    }
})
</script>