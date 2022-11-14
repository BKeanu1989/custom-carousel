import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// import typescript from '@rollup/plugin-typescript';
// console.log("🚀 ~ file: vite.config.js ~ line 5 ~ typescript", typescript)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // {
    //   ...typescript({ tsconfig: './tsconfig.json' }),
    //   apply: 'build',
    //   declaration: true,
    //   declarationDir: 'types/',
    //   rootDir: '/'
    // },
    vue(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "custom-carousel",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  server: {
    host: true,
  },
});
