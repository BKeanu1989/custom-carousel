import { describe, it, expect } from "vitest";

import { nextTick } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Slider from "../components/Slider.vue";

describe("Slider functionality", () => {
  it("loads correctly", () => {
    const wrapper = mount(Slider, {
      props: {
        slides: [
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-1-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-1-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-1-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-4-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-4-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-4-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-4-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-9-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-9-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-9-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-7-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-7-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-7-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-12-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-12-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-12-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-12-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-3-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-3-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-3-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-3-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-1-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-1-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-1-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-4-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-4-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-4-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-4-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-9-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-9-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-9-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-7-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-7-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-7-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-12-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-12-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-12-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-12-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-1-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-1-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-1-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-4-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-4-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-4-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-4-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-9-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-9-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-9-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="667" height="1000" src="/Helen-Woigk©Steffen-Roth-7-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-7-optimized.jpg 667w, /Helen-Woigk©Steffen-Roth-7-optimized-200x300.jpg 200w" sizes="(max-width: 667px) 100vw, 667px" />',
          '<img width="1000" height="667" src="/Helen-Woigk©Steffen-Roth-12-optimized.jpg" class="attachment-full size-full" alt="" loading="lazy" srcset="/Helen-Woigk©Steffen-Roth-12-optimized.jpg 1000w, /Helen-Woigk©Steffen-Roth-12-optimized-300x200.jpg 300w, /Helen-Woigk©Steffen-Roth-12-optimized-768x512.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px" />',
        ],
        breakPoints: [
          {
            1600: {
              itemsToShow: 4,
            },
            1200: {
              itemsToShow: 3,
            },
            800: {
              itemsToShow: 2,
            },
            400: {
              itemsToShow: 1,
            },
          },
        ],
      },
    });
  });
});
