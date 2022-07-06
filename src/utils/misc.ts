import {type BreakPoint} from '../types/BreakPoints'

function getCurrentBreakPointWidth(widthOfElement: number, breakPoints: BreakPoint[]) {
    console.log("begin")
}

function calcCombinedWidth(slides, breakPoints) {
  let width = 0;
  const imagesToShow = getCurrentBreakPointWidth(window.innerWidth, breakPoints);
  const slidesToShowWidth = slides.slice(0, imagesToShow)

  width = slidesToShowWidth.reduce((acc, slide) => {
      return acc + getWidthOfImage(slide)
  }, 0)

  return width
}

export function getWidthOfImage(slide: string) :number {
    const parser = new DOMParser()
    const doc = parser.parseFromString(slide, 'text/html')
    const img = doc.querySelector('img')
    if (!img) return 0;

    const imageWidth = img.width

    return imageWidth
}a