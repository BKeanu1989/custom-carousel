import {type BreakPoint} from '../types/BreakPoints'

export function getBreakPointWidth(widthOfElement: number, breakPoints: BreakPoint) {
    console.log("breakPoints", breakPoints)
    const keys = Object.keys(breakPoints);
    const _keys = keys.map(key => parseInt(key));

    const test = _keys.reduce((prev, cur) => {
        if (prev < widthOfElement && cur > widthOfElement) {
            return Math.min(prev, cur);
        } 
        return cur;
    })
    return breakPoints[test].itemsToShow;
}

function calcCombinedWidth(slides, breakPoints) {
  let width = 0;
  const imagesToShow = getBreakPointWidth(window.innerWidth, breakPoints);
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
}