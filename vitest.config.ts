/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // error while installing
    // coverage: {
    //   provider: "istanbul",
    // },
    setupFiles: ["./src/test-setup.js"],
  },
  plugins: [vue()],
});
