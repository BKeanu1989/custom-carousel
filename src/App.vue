<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Slider from './components/Slider.vue'

const slides = ['<img src="https://via.placeholder.com/150">', '<img src="https://via.placeholder.com/250">']

</script>


<template>
  <Slider :slides="slides">

  </Slider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
