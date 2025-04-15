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
        inter: ['Inter', 'sans-serif'],
        notoserif: ['Noto Serif', 'serif'],
        hedwig: ['Hedwig Letters Sans', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

