<template>
    <div class="cc-absolute cc-z-10">
        <button @click="$emit('prev')" class="cc-prev cc-top-0 cc-left-0">prev</button>
        <button @click="$emit('next')" class="cc-next cc-top-0 cc-right-0">next</button>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['prev', 'next'])
</script>