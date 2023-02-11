/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-once": "bounce 2s ease-in-out 1",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-debug-screens")],
};
