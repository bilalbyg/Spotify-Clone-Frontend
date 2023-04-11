/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        backdrop:'#121212',
        primary:'#1db954',
        active: '#282828',
        link: '#b3b3b3',
        footer: '#181818',
        podcastHover : 'rgb(255 255 255 / 10%)',
        podcast : 'rgb(255 255 255 / 20%)'
      },
      boxShadow:{
        spotify : '0 2px 4px 0 rgb(0 0 0 / 20%)',
        podcast : '0 4px 60px 0 rgb(0 0 0 / 50%)'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
