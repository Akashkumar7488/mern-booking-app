/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        'hero-bottom': '4rem', // increasing padding to bottom for Hero.js
      },
    },
    container:{
      padding:{
        md:"10rem",
      }
    }
  },
  plugins: [],
}
