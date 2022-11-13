/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#e65100",
        lightPrimary: "rgba(230, 81, 0, .7)",
        secondary: "#bdbdbd",
        success: "#2a9d8f",
        lightSuccess: "rgba(42, 157, 143, .3)",
        danger: "#ef5350",
      },
    },
  },
  plugins: [],
};
