<template>
    <div class="cc-absolute cc-z-10">
        <button @click="$emit('prev')">prev</button>
        <button @click="$emit('next')">next</button>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['prev', 'next'])
</script>