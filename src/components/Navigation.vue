<template>
    <div class="cc-z-40">
        <LeftArrowIcon @click="$emit('prev')" class="cc-absolute cc-prev cc-top-0 cc-left-0" />
        <RightArrowIcon @click="$emit('next')" class="cc-absolute cc-next cc-top-0 cc-right-0"></RightArrowIcon>
    </div>
</template>
<script setup lang="ts">
import LeftArrowIcon from '../icons/LeftArrowIcon.vue';
import RightArrowIcon from '../icons/RightArrowIcon.vue';
const emit = defineEmits(['prev', 'next'])
</script>