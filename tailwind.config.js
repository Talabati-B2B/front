/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#062454',
        page: '#F5F6F8',
        accent: '#F97316',
        heading: '#1F2937',
        body: '#6B7280',
        success: '#16A34A',
        line: {
          DEFAULT: '#E5E7EB',
          dark: '#D1D5DB',
        },
      },
    },
  },
  plugins: [],
}