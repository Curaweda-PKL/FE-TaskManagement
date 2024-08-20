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
      width:{
        'w100' : '500px',
      },
      screens: {
        'max1000': {'max': '1020px'},
        'max850': {'max': '851px'},
        'max768': {'max': '768px'},
      },
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

