/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light_gray: "#FAFAFA",
        //  navy_blue:"#002366",
        navy_blue: "#0BBBA1",
        hover_effect:"#3FCBB4",
        // light_blue: "#EDF3FF",
        light_blue:"#E0F7F4",
        text_black: "#1E1E1E",
        soft_gray: "#B0B0B0",
        gray: "#696969",
        gray2: "#d9d9d9",
        red: "#C31B1B",
      },
      fontFamily: {
        wallpoet: ["Wallpoet", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        custom: "0px 1px 6px 0px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        scaling: "scaling 2s ease-in-out infinite",
        scaling2: "scaling2 3s ease-in-out infinite",
      },
      keyframes: {
        scaling: {
          "0%, 100%": { transform: "scale(1.3)", opacity: "0.8" },
          "50%": { transform: "scale(1.5)", opacity: "0.6" },
        },
        scaling2: {
          "0%, 100%": { transform: "scale(1.1)", opacity: "0.8" },
          "50%": { transform: "scale(1.2)", opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
