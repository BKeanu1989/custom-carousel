import { describe, it, expect } from "vitest";
import { getMimeTypeFromImageUrl, getNameFromImageUrl } from "../utils/misc";

describe("utils", () => {
  it("gets correct png mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth-12-optimized.jpg"
      )
    ).toBe("image/jpeg");
  });

  it("gets correct jpg mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth-12-optimized.jpg"
      )
    ).toBe("image/jpeg");
  });

  it("gets correct jpeg mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.jpeg"
      )
    ).toBe("image/jpeg");
  });

  it("gets correct avif mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.avif"
      )
    ).toBe("image/avif");
  });

  it("gets correct webp mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.webp"
      )
    ).toBe("image/webp");
  });

  it("gets filename from url", () => {
    expect(
      getNameFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.png"
      )
    ).toBe("Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.png");
  });
});
