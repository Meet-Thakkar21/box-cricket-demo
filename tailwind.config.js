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
          green: '#15803d',     /* Deep professional green */
          lightGreen: '#22c55e',/* Vibrant turf green for highlights */
          orange: '#ea580c',    /* Action orange */
          yellow: '#facc15',    /* Highlight yellow */
        },
        light: {
          900: '#f8fafc',       /* Very light gray background */
          800: '#ffffff',       /* White cards */
          700: '#f1f5f9',       /* Slightly darker gray for hover/borders */
          600: '#e2e8f0',       /* Borders */
          text: '#0f172a',      /* Dark text */
          muted: '#64748b',     /* Muted text */
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
