/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        background: '#0f1117',
        card: '#1a1d27',
        accent: '#6c63ff',
        success: '#22c55e',
        missing: '#ef4444',
        textMain: '#e2e8f0',
      }
    },
  },
  plugins: [],
}

