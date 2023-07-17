/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    minHeight: {
      10: "10",
    },
    extend: {
      colors: {
        "light-sky": "#EBF5FF",
        green: "#30BC97",
        gray: "#1C1C1E",
        primary: "#516B9E",
        "dark-gray": "#00140E",
        "gray-700": "#707EAE",
        purple: "#783efd",

        "per-25": "#FF5D9E",
        "per-50": "#5B48CC",
        "per-75": "#0E5F4C",
      },
      backgroundImage: {},
      keyframes: {
        "left-to-right": {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(1rem)" },
          "100%": { transform: "translateX(0)" },
        },
        "bottom-to-top": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(1rem)" },
          "100%": { transform: "translateY(0)" },
        },
        "bottom-to-top-wide": {
          "0%": { transform: "translateY(-8rem)" },
          "50%": { transform: "translateY(0rem)" },
          "100%": { transform: "translateY(-8rem)" },
        },
        "custom-ping": {
          "100%": { transform: "scale(1.2)" },
        },
      },
      animation: {
        "left-to-right": "left-to-right 3s linear infinite",
        "left-to-right-half": "left-to-right 2s linear infinite",
        "bottom-to-top": "bottom-to-top 5s linear infinite",
        "bottom-to-top-wide": "bottom-to-top-wide 10s linear infinite",
        "custom-ping": "custom-ping 0.2s",
      },
      rotate: {
        25: "25deg",
      },
      zIndex: {
        1000: "1000",
      },
    },
    screens: {
      sm: { max: "576px" },

      md: { max: "768px" },

      lg: { max: "1024px" },

      xl: { max: "1280px" },

      "2xl": { max: "1536px" },
    },
    minWidth: {
      64: "16rem",
    },
  },
};
