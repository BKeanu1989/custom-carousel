<template>
    <div class="sw-z-40">
        <slot name="leftArrow">
            <LeftArrowIcon @click="$emit('prev')" class="sw-absolute sw-prev sw-top-[43%] sw-left-0 hover:sw-cursor-pointer"></LeftArrowIcon>
        </slot>
        <slot name="rightArrow">
            <RightArrowIcon @click="$emit('next')" class="sw-absolute sw-next sw-top-[43%] sw-right-0 hover:sw-cursor-pointer"></RightArrowIcon>
        </slot>
    </div>
</template>
<script setup lang="ts">
import LeftArrowIcon from '../icons/LeftArrowIcon.vue';
import RightArrowIcon from '../icons/RightArrowIcon.vue';
const emit = defineEmits(['prev', 'next'])
</script>