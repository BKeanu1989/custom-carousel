<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from 'vue'
import Slider from './components/Slider.vue'

const slides = [
  '<img width="870" height="580" src="http://localhost:4444/wp-content/uploads/2022/03/Jutta_Fastian_2021__c_Marlene_Rahmann_Web_13_e9027d8aea.jpg" sizes="(max-width: 870px) 100vw, 870px" />', 
  '<img width="870" height="580" src="http://localhost:4444/wp-content/uploads/2022/03/Jutta_Fastian_2021__c_Marlene_Rahmann_Web_12_2_65f5c8a86f.jpg" sizes="(max-width: 870px) 100vw, 870px" />', 
  '<img width="870" height="580" src="http://localhost:4444/wp-content/uploads/2022/03/Jutta_Fastian_2021__c_Marlene_Rahmann_Web_102_c0facfd275.jpg" sizes="(max-width: 870px) 100vw, 870px" />', 
  '<img width="467" height="700" src="http://localhost:4444/wp-content/uploads/2022/03/Jutta_Fastian_2021__c_Marlene_Rahmann_Web_78_56229fda60.jpg" sizes="(max-width: 467px) 100vw, 467px" />',
  '<img width="870" height="580" src="http://localhost:4444/wp-content/uploads/2022/04/Leonie_Parusel__1__6e84b98556.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="http://localhost:4444/wp-content/uploads/2022/04/Leonie_Parusel__1__6e84b98556.jpg 870w, http://localhost:4444/wp-content/uploads/2022/04/Leonie_Parusel__1__6e84b98556-300x200.jpg 300w, http://localhost:4444/wp-content/uploads/2022/04/Leonie_Parusel__1__6e84b98556-768x512.jpg 768w" sizes="(max-width: 870px) 100vw, 870px" />'
]

const _slides = ref(slides.map((slide) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(slide, 'text/html')
  return doc.querySelector('img')
}))
</script>


<template>
  <Slider :slides="_slides" :toShow="4">

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
