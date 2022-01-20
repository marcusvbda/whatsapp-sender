const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      backgroundImage: {
        "logo-svg": "url('/images/logo.svg')",
        "locked-svg": "url('/images/locked.svg')",
      },
      spacing: {
        "140neg": "-140px",
      },
      fontFamily: {
        montserrat: ["Montserrat"],
        lato: ["Lato"],
        garamond: ["Garamond"],
      },
      colors: {
        esmerald: "#00BFA5",
        dark: "#26404D",
        darkest: {
          900: "#131C21",
          800: "#1D262C",
          700: "#494949",
        },
        white: colors.white,
        transparent: "transparent",
      },
      height: {
        "222px": "222px",
        "65px": "65px",
        "160px": "160px",
        "5px": "5px",
        "15px": "15px",
      },
      width: {
        "65px": "65px",
        "160px": "160px",
        "15px": "15px",
        "40%": "40%",
      },
      keyframes: {
        wiggle: {
          "0%": { left: "-40%" },
          "50%": { left: "100%" },
          "100%": { left: "-40%" },
        },
      },
      animation: {
        wiggle: "wiggle 3s ease-in-out infinite",
      },
    },
  },
};
