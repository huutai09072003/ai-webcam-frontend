/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Quan trọng để Tailwind áp dụng vào các file .tsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
