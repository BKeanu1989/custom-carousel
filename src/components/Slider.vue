<template>
    <div class="custom-carousel cc-flex cc-relative cc-w-f cc-overflow-x-hidden" ref="root">
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
                    :class="{active: index === activeIndex, inActive: index !== activeIndex}"
                    ref="slideRefs"
                    >
                </Slide>
            </slot>
        </div>
        <div>
          {{ activeIndex }}

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
const _loop = ref<any>(null)

const slideRefs = ref([])
const combinedWidth = ref(0)
const activeIndex = ref(0)

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


function getWidthOfImage(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth
}

function prev() {
  _loop.value.previous({duration: 0.8, ease: 'power1.inOut'})

}

function next() {
  _loop.value.next({duration: 0.8, ease: 'power1.inOut'})
}

function onCompleteFn() {
  console.log(_loop.value.current(), slideRefs.value)
  const curIndex = _loop.value.current()
  const slideToAddCss = slideRefs.value[curIndex]
  if (slideToAddCss) {
    console.log(slideToAddCss)
  }
}

function horizontalLoop(items, config) {
	items = gsap.utils.toArray(items);
	config = config || {};
	let tl = gsap.timeline({onComplete: () => console.log("only gets called when end is hit"),repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
		length = items.length,
		startX = items[0].offsetLeft,
		times = [],
		widths = [],
		xPercents = [],
		curIndex = 0,
		pixelsPerSecond = (config.speed || 1) * 100,
		snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
		populateWidths = () => items.forEach((el, i) => {
      widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
      xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
    }),
    getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
      totalWidth, curX, distanceToStart, distanceToLoop, item, i;
	populateWidths();
  gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
		xPercent: i => xPercents[i]
	});
	gsap.set(items, {x: 0});
	totalWidth = getTotalWidth();
	for (i = 0; i < length; i++) {
		item = items[i];
		curX = xPercents[i] / 100 * widths[i];
		distanceToStart = item.offsetLeft + curX - startX;
		distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
		tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond, onComplete: onCompleteFn}, 0)
		  .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
		  .add("label" + i, distanceToStart / pixelsPerSecond);
		times[i] = distanceToStart / pixelsPerSecond;
	}
	function toIndex(index, vars) {
    console.log(index)
    // TODO: not really working due to gsap ...
    activeIndex.value = index
		vars = vars || {};
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
  tl.updateIndex = () => curIndex = Math.round(tl.progress() * items.length);
	tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  if (config.draggable && typeof(Draggable) === "function") {
    let proxy = document.createElement("div"),
        wrap = gsap.utils.wrap(0, 1),
        ratio, startProgress, draggable, dragSnap, roundFactor,
        align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
        syncIndex = () => tl.updateIndex();
    typeof(InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
    draggable = Draggable.create(proxy, {
      trigger: items[0].parentNode,
      type: "x",
      onPress() {
        startProgress = tl.progress();
        tl.progress(0);
        populateWidths();
        totalWidth = getTotalWidth();
        ratio = 1 / totalWidth;
        dragSnap = totalWidth / items.length;
        roundFactor = Math.pow(10, ((dragSnap + "").split(".")[1] || "").length);
        tl.progress(startProgress);
      },
      onDrag: align,
      onThrowUpdate: align,
      inertia: true,
      snap: value => {
        let n = Math.round(parseFloat(value) / dragSnap) * dragSnap * roundFactor;
        return (n - n % 1) / roundFactor;
      },
      onRelease: syncIndex,
      onThrowComplete: () => gsap.set(proxy, {x: 0}) && syncIndex()
    })[0];
    
    tl.draggable = draggable;
  }
  
	return tl;
}


defineExpose({
    slideRefs
})

onMounted(() => {
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        sliderWidth.value = rect.width

        const slidesToShowWidth = props.slides.slice(0, props.toShow)

        combinedWidth.value = slidesToShowWidth.reduce((acc, slide) => {
            return acc + getWidthOfImage(slide)
        }, 0)

        // setLefts()
        rootMounted.value = true
    }

    setTimeout(() => {
      const boxes = gsap.utils.toArray('.cc-slide')
      _loop.value = horizontalLoop(boxes, {paused: true, draggable: true});
      boxes.forEach((box, i) => box.addEventListener("click", () => _loop.value.toIndex(i, {duration: 0.8, ease: "power1.inOut"})));
    }, 50);


})
</script>

<style>
.custom-carousel--inner {
  /* height: 20%; */
  /* width: 60%; */
  /* background: #555; */
  position: relative;
  display: flex;
  align-items: center;
  /* overflow: hidden; */
}


.cc-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: green; */
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

.cc-slide.active {
  transform: scale(1.1);
}

.cc-slide.inActive {
  filter: opacity(.7)
}

</style>