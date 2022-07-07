# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)


## Notes
https://codepen.io/osublake/pen/gaQNLK
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Ordering_Flex_Items
https://stackoverflow.com/questions/18846481/use-transition-on-flexbox-order

https://codepen.io/PointC/pen/eYGvgym/2cb33399a603622390d57072bd1d6844


# old package script
```
{
  "name": "sw-carousel",
  "version": "0.0.8",
  "files": [
    "dist",
    "CHANGELOG.md"
  ],
  "main": "./dist/sw-carousel.umd.js",
  "module": "./dist/sw-carousel.es.js",
  "exports": {
    ".": {
      "import": "./dist/sw-carousel.es.js",
      "require": "./dist/sw-carousel.umd.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/BKeanu1989/custom-carousel"
  },
  "scripts": {
    "dev": "concurrently \"vite\" \"npm:tailwind\"",
    "build": "vite build && npx tailwindcss -i ./src/input.css -o ./dist/sw-carousel.css",
    "preview": "vite preview",
    "tailwind": "npx tailwindcss -i ./src/input.css -o ./dist/sw-carousel.css --watch",
    "release": "npm run build && npx standard-version && git push --follow-tags origin master && npm publish"
  },
  "dependencies": {
    "gsap": "^3.10.4",
    "vue": "^3.2.25"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^2.3.3",
    "concurrently": "^7.2.2",
    "eslint": "^8.17.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-vue": "^9.1.1",
    "prettier": "^2.7.0",
    "tailwindcss": "^3.1.3",
    "vite": "^2.9.9"
  }
}

```