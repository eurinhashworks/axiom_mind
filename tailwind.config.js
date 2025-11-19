/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'axiom-dark': '#101014',
        'axiom-medium': '#1D1D23',
        'axiom-light': '#2C2C35',
        'axiom-accent': '#6A45FF',
        'axiom-accent-hover': '#7B5BFF',
        'axiom-text-primary': '#EAEAEB',
        'axiom-text-secondary': '#A0A0A3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        popIn: 'popIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
