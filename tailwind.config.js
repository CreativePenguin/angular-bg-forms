/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{html, js}"
  ],
  theme: {
    colors: {
      'material': {
        100: 'rgb(231, 228, 191)',
        300: '#626200',
        400: '#797869'
      }
    },
    extend: {},
  },
  plugins: [],
}

