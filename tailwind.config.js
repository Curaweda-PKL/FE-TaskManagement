/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'Newsreader'],
      },
      screens: {
        'max1000': {'max': '1020px'},
        'max850': {'max': '851px'},
        'max768': {'max': '768px'},
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

