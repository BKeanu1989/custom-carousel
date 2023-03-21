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
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth-12-optimized.png"
      )
    ).toBe("image/png");
  });

  it("gets correct jpg mime type", () => {
    expect(
      getMimeTypeFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.png"
      )
    ).toBe("image/png");
  });

  it("gets filename from url", () => {
    expect(
      getNameFromImageUrl(
        "http://localhost:3000/Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.png"
      )
    ).toBe("Helen-Woigk%C2%A9Steffen-Roth..-12-optimized.png");
  });
});
