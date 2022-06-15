<template>
    <div>
        <div v-html="slide"></div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    slide: {
        type: Object,
        required: true,
    }
})
</script>