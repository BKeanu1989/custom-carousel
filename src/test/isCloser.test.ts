import { describe, it, expect, beforeEach } from "vitest";

const array = [...Array(10).keys()];

function isClose(
  array: number[],
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

describe("Navigation", () => {
  it.skip("is closer to number", () => {
    expect(isClose(array, 3, 5)).toBe(true);
    expect(isClose(array, 3, 6)).toBe(false);
    expect(isClose(array, 3, 7)).toBe(false);

    // expect(indexOfClosest(4, 3, 6)).toBe(true);
  });
  it("is closer to number not overflows", () => {
    expect(isClose(array, 0, 9)).toBe(true);
    expect(isClose(array, 3, 5)).toBe(true);
    expect(isClose(array, 7, 9)).toBe(true);

    // expect(indexOfClosest(4, 3, 6)).toBe(true);
  });
});
