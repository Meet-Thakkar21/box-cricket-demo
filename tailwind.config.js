/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sports: {
          green: '#22c55e',     /* Vibrant turf green */
          orange: '#ea580c',    /* Cricket ball orange/red */
          yellow: '#facc15',    /* Bright yellow for highlights */
          light: '#e2e8f0',     /* Light text */
        },
        dark: {
          900: '#022c22',       /* Very dark green (night turf) */
          800: '#064e3b',       /* Dark stadium green */
          700: '#065f46',       /* Slightly lighter green */
          600: '#047857',       /* Highlight dark green */
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'sports-green': '0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)',
        'sports-orange': '0 0 10px rgba(234, 88, 12, 0.5), 0 0 20px rgba(234, 88, 12, 0.3)',
        'sports-yellow': '0 0 10px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3)',
      },
    },
  },
  plugins: [],
}
