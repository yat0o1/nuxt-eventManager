module.exports = {
    darkMode: 'class',
    content: [
      './components/**/*.{vue,js,ts}',
      './layouts/**/*.vue',
      './pages/**/*.vue',
      './plugins/**/*.{js,ts}',
      './nuxt.config.{js,ts}',
      './src/**/*.css'
    ],
    theme: {
      extend: {
        screens: {
          'xs': '480px',
        },
        colors: {
        },
        fontFamily: {
          'rubik': ['Rubik', 'sans-serif']
        },
      },
    },
  }