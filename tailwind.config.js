/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      colors: {
				gold: '#C7AC7F',
				blueish: '#006F7C',
				black: '#141414',
				'sb-grey': '#3A3A3B',
				'white-dark': '#f2f2f2',
				disabled: '#8c8c8c',
			},
    },
  },
  plugins: [],
  prefix: "sw-"
}
