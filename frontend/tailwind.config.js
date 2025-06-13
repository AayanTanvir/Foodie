/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif',],
        hedwig: ['Hedvig Letters Sans', 'sans-serif'],
        notoserif: ['Noto Serif', 'serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

