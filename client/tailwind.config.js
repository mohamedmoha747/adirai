/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#14121A',
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        ember: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
      boxShadow: {
        card: '0 14px 40px -18px rgb(20 18 26 / 0.25)',
      },
    },
  },
  plugins: [],
};
