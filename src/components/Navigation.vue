<template>
    <div class="cc-z-10">
        <button @click="$emit('prev')" class="cc-absolute cc-prev cc-top-0 cc-left-0">prev</button>
        <button @click="$emit('next')" class="cc-absolute cc-next cc-top-0 cc-right-0">next</button>
    </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['prev', 'next'])
</script>