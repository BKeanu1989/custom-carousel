/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    "prettier",
    // "@vue/eslint-config-prettier",
  ],
  env: {
    // "vue/setup-compiler-macros": true,
  },
};
