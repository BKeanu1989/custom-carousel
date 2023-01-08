import { type BreakPoint } from "../types/BreakPoints";

export function getBreakPointWidth(
  widthOfElement: number,
  breakPoints: BreakPoint
) {
  const keys = Object.keys(breakPoints);
  const _keys = keys.map((key) => parseInt(key));

  const test = _keys.reduce((prev, cur) => {
    if (prev < widthOfElement && cur > widthOfElement) {
      return Math.min(prev, cur);
    }
    return cur;
  });
  return breakPoints[test].itemsToShow;
}

function calcCombinedWidth(slides: any[], breakPoints: BreakPoint) {
  let width = 0;
  const imagesToShow = getBreakPointWidth(window.innerWidth, breakPoints);
  const slidesToShowWidth = slides.slice(0, imagesToShow);

  width = slidesToShowWidth.reduce((acc: number, slide: any) => {
    return acc + getWidthOfImage(slide);
  }, 0);

  return width;
}

export function getWidthOfImage(slide: string): number {
  const parser = new DOMParser();
  const doc = parser.parseFromString(slide, "text/html");
  const img = doc.querySelector("img");
  if (!img) return 0;

  const imageWidth = img.width;

  return imageWidth;
}

interface RatioInfo {
  aspectRatio: string;
  width: number;
  height: number;
}
export function getAspectRatio(item: string): RatioInfo | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(item, "text/html");
  const img = doc.querySelector("img");
  if (!img) return null;

  const imageWidth = img.width;
  const imageHeight = img.height;

  return {
    aspectRatio: `${imageWidth} / ${imageHeight}`,
    height: imageHeight,
    width: imageWidth,
  };
}

export function getPhotographerCredits(htmlAsString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlAsString, "text/html");
  const img = doc.querySelector("img");
  if (!img) return "";

  try {
    return plainGetPhotoCredits(img.src);
  } catch (error) {
    console.log(error);
    return "";
  }
}

export function plainGetPhotoCredits(url: string) {
  try {
    const regex = /(©|%C2%A9|__c__|__c_)(.*)(.jpg|.jpeg|.webp)$/g;
    // (©|%C2%A9)(\s*)(.*?)( \(\d*\))(-optimized)?
    const match = regex.exec(url);
    if (!match) return "";

    // (\w*)((\d*)?(-scaled|-optimized|-opt)?)?
    const removeSuffixRegex = /((\d*)?(-scaled|-optimized|-opt)?)?$/g; //g
    const tmpResult = match[2].replace(removeSuffixRegex, "");

    let result = tmpResult.replaceAll("-", " ").trim();

    const blackListedChars = /\(.*\)/g;
    result = result.replace(blackListedChars, "");
    result = result.replaceAll("_", " ").trim();

    result = result.replace(/\d/g, "");
    result = result.replace(/(High|Res|Kopie)/g, "");

    result = titleCase(result).trim();

    return result;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export function isClose(
  array: any[],
  index: number,
  active: number,
  modifier: number = 2
) {
  const left = (active - modifier + array.length) % array.length;
  const right = (active + modifier + array.length) % array.length;
  const new_result = (index + array.length) % array.length;

  if (left > right) {
    if (left <= new_result) return true;
    if (new_result <= right) return true;
  }

  if (left <= new_result && right >= new_result) return true;
  return false;
}

function titleCase(str: string) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}
