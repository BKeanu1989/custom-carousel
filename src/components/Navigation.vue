<template>
    <div class="cc-relative cc-z-10">
        <button @click="$emit('prev')" class="cc-prev">prev</button>
        <button @click="$emit('next')" class="cc-next">next</button>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['prev', 'next'])
</script>