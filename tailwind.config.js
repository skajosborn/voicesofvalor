/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vov: {
          darkBg: "#0c1522",
          darkNavy: "#090f18",
          cardBorder: "#24354a",
          cardBg: "#111c2a",
          gold: "#e6b749",
          goldLight: "#fae19c",
          goldMuted: "#b89033",
          red: "#c92a2a",
          redBright: "#e03131",
          cream: "#f1ece1",
          creamMuted: "#e2dacb",
          footerText: "#2d3748"
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        headline: ['"Oswald"', 'sans-serif'],
        script: ['"Playball"', '"Alex Brush"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
