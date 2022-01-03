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
        white: colors.white,
        transparent: "transparent",
      },
      height: {
        "222px": "222px",
        "65px": "65px",
      },
      width: {
        "65px": "65px",
      },
    },
  },
};
