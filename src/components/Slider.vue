<template>
    <div class="carousel">
        
        <slot name="navigation">

        </slot>
        <slot>
            <Slide v-for="(slide, index) in slides" :key="index" :slide="slide"></Slide>
        </slot>
        <slot name="pagination">

        </slot>
    </div>
</template>
<script setup lang="ts">
import Slide from './Slide.vue'

const props = defineProps({
    slides: {
        type: Array,
        required: true,
    }
})
</script>