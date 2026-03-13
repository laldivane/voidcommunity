/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          bg: '#988ce0', // the outer background in the image seems to be a soft purple or gradient
          900: '#1a1835', // dark purple panel
          800: '#232049', // slightly lighter panel
          700: '#2c2859',
          border: 'rgba(255, 255, 255, 0.05)',
        },
        card: {
          dark: 'rgba(20, 18, 40, 0.6)',
          light: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          purple: '#b347ff',
          cyan: '#00e5ff',
          magenta: '#ff007f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
      }
    },
  },
  plugins: [],
}