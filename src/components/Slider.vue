<template>
    <div class="custom-carousel cc-flex cc-relative cc-w-f cc-overflow-x-hidden" ref="root">
        <span class="cc-z-10">
            {{ activeIndex }}
        </span>
        
        <!-- <slot name="navigation"> -->
            <Navigation @prev="prev" @next="next" />
        <!-- </slot> -->
        <div class="custom-carousel--inner" ref="innerTrack">
            <slot>
                <Slide v-for="(slide, index) in slides" :key="index" 
                    :slide="slide" 
                    :sliderWidth="sliderWidth" 
                    class="cc-slide" 
                    :rootMounted="rootMounted" 
                    :toShow="props.toShow"
                    :imageToShowCombinedWidth="combinedWidth"
                    :style="{}"
                    ref="slideRefs"
                    >
                </Slide>
            </slot>
        </div>
        <slot name="pagination">

        </slot>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import Slide from './Slide.vue'
import Navigation from './Navigation.vue'
import gsap from 'gsap'

const root = ref<HTMLElement | null>(null)
const innerTrack = ref<HTMLElement | null>(null)

const rootMounted = ref(false)
const sliderWidth = ref(0)
const widthsOfSlides = ref<number[]>([])

const slideRefs = ref([])
const combinedWidth = ref(0)
const activeIndex = ref(0)
const activeSlide = computed(() => {

    return slideRefs.value[activeIndex.value]
})

// const activeSlideWidth = computed(() => {
//     return activeSlide.value.width
// })

// const prevSlide = computed(() => {
//     return slideRefs.value[activeIndex.value - 1]
// })

// const nextSlide = computed(() => {
    
//     return slideRefs.value[activeIndex.value + 1]
// })
// const prevSlide = ref

// watch(activeIndex, (newVal) => {
//   updateSlide(newVal)
// })

const props = defineProps({
    slides: {
        type: Array as PropType<string[]>,
        required: true,
    },
    toShow: {
        type: Number,
        required: true,
    }
})

// function updateSlide(index: number) {
//     const tl = gsap.timeline()


//     if (index === 0) {
//         // innerTrack.value!.style.transform = `translateX(0px)`
//         return
//     }

//     const slidesWidth = slideRefs.value.splice(0, index).reduce((acc, slide) => {
//         return acc + slide.width
//     }, 0)

//     // innerTrack.value!.style.transform = `translateX(-${slidesWidth}px)`
// }

function getWidthOfImage(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth
}

// /**
//  * 
//  * @param slide HTMLImageElement
//  */
// function getWidthForSlide(slide: string, combinedWidth: number) :number {
//     const parser = new DOMParser()
//     const doc = parser.parseFromString(slide, 'text/html')
//     const img = doc.querySelector('img')
//     if (!img) return 0;

//     const imageWidth = img.width / combinedWidth * sliderWidth.value

//     return imageWidth
// }

// function setLefts() {
//     slideRefs.value.forEach((slideRef, index) => {
//         const leftPos = getLeft(index)
//         slideRef.setLeftPosition(leftPos)
//     })
// }

// function getLeft(index: number) {
//     const leftPosition = widthsOfSlides.value.slice(0, index).reduce((acc, cur) => acc + cur, 0)
    
//     return leftPosition
// }

function prev() {

    // if (activeIndex.value === 0) {
    //     activeIndex.value = props.slides.length - 1
    //     return
    // }

    // activeIndex.value--
}

function next() {
    // if (activeIndex.value === props.slides.length - 1) {
    //     activeIndex.value = 0
    //     return
    // }

    // activeIndex.value++
}



function horizontalLoop(items, config) {
  console.log("🚀 ~ file: Slider.vue ~ line 156 ~ horizontalLoop ~ items", items)
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth, curX, distanceToStart, distanceToLoop, item, i;
  gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      console.log("🚀 ~ file: Slider.vue ~ line 172 ~ horizontalLoop ~ w", w)
      xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
      return xPercents[i];
    }
  });
  gsap.set(items, {x: 0});
  totalWidth = items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = xPercents[i] / 100 * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
      .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    console.log("to index: ", index, vars);
    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = vars => toIndex(curIndex+1, vars);
  tl.previous = vars => toIndex(curIndex-1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}


defineExpose({
    slideRefs
})

// const loop = ref<any>(null)

onMounted(() => {
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        sliderWidth.value = rect.width

        const slidesToShowWidth = props.slides.slice(0, props.toShow)

        combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
            return acc + getWidthOfImage(slide)
        }, 0)

        // widthsOfSlides.value = props.slides.map(slide => getWidthForSlide(slide, combinedWidth.value))
        // setLefts()
        rootMounted.value = true
    }

    const wrapper = document.querySelector(".custom-carousel--inner");
    const boxes = gsap.utils.toArray(".cc-slide");

    const loop = horizontalLoop(boxes, {paused: true});


    boxes.forEach((box, i) => box.addEventListener("click", () => loop.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));

    document.querySelector(".cc-next").addEventListener("click", () => loop.next({duration: 0.4, ease: "power1.inOut"}));
    document.querySelector(".cc-prev").addEventListener("click", () => loop.previous({duration: 0.4, ease: "power1.inOut"}));

})
</script>

<style>
.custom-carousel--inner {
  /* height: 20%; */
  /* width: 60%; */
  background: #555;
  position: relative;
  display: flex;
  align-items: center;
  /* overflow: hidden; */
}


.cc-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: green;
  height: 80%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  flex-shrink: 0;
  color: black;
  font-size: 21px;
  cursor: pointer;
}

</style>