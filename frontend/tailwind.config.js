// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Agora o caminho é relativo a 'frontend/'
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso está correto DENTRO da pasta frontend
  ],
  darkMode: 'media', 
  theme: {
    extend: {},
  },
  plugins: [],
}