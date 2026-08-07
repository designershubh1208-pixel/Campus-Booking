/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode via a 'dark' class on the html/body tag
  theme: {
    extend: {
      colors: {
        // Custom background colors
        lightBg: '#f9fafb',
        darkBg: '#0f172a',  // slate-900
        // Primary brand color (Indigo)
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
