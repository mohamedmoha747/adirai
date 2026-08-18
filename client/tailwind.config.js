/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#17171d',
        brand: {
          50: '#f6f0ff',
          100: '#efe3ff',
          200: '#dcc4ff',
          300: '#c39dff',
          400: '#a566ff',
          500: '#8a3dff',
          600: '#7a2cea',
          700: '#5f2bcf',
          800: '#4827a6',
          900: '#2d1a67',
        },
        cyan: {
          400: '#30d3ea',
          500: '#1ebad8',
        },
        soft: {
          50: '#f8f8fb',
          100: '#f3f4f6',
          200: '#e7e8ef',
          300: '#d9dce5',
          400: '#a9afc0',
          500: '#79829a',
          600: '#586070',
        },
      },
      boxShadow: {
        card: '0 14px 30px -18px rgba(32, 24, 56, 0.24)',
        soft: '0 10px 25px -18px rgba(88, 96, 112, 0.4)',
      },
      borderRadius: {
        app: '2rem',
      },
    },
  },
  plugins: [],
};
