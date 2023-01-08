import { describe, it, expect, beforeEach } from "vitest";

function goToSlide(array: number[], index: number) {
  return (index + array.length) % array.length;
}

let activeIndex = 0;
let array = [...Array(5).keys()];

beforeEach(() => {
  activeIndex = 0;
  array = [...Array(5).keys()];
});

describe("Navigation", () => {
  it("should prev correctly", () => {
    const prev = () => {
      --activeIndex;
      return goToSlide(array, activeIndex);
    };

    expect(prev()).toBe(4);
    expect(prev()).toBe(3);
    expect(prev()).toBe(2);
    expect(prev()).toBe(1);
    expect(prev()).toBe(0);
  });
  it("should next correctly", () => {
    const next = () => {
      ++activeIndex;
      return goToSlide(array, activeIndex);
    };
    expect(next()).toBe(1);
    expect(next()).toBe(2);
  });
});
