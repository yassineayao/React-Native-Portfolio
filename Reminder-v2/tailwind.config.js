/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#efc220",
        headerBackground: "#233590",
        containerBackground: "#f5f8ff",
      },
    },
  },
  plugins: [],
};
