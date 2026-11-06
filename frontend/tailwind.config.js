/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07050d',
          900: '#0d0a14',
          850: '#130f1e',
          800: '#181427',
          750: '#1f1933',
          700: '#282042',
          600: '#3a2e5e',
        },
        brand: {
          purple: '#7c3aed',
          violet: '#8b5cf6',
          dark: '#0d0a14',
          accent: '#c084fc',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'elevated': '0 12px 30px -4px rgba(0, 0, 0, 0.6)'
      }
    },
  },
  plugins: [],
}
