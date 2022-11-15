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

        category: "#ffe1c5",
        favorite: "#e5c1e5",
        history: "#d7d8f8",
        cart: "#d7d8f8",
        mBox: "#5e03c2",
        m6Box: "#122e51",
        yBox: "#0e0050",
      },
    },
  },
  plugins: [],
};
