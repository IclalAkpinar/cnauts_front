/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
 theme: {
  extend: {
   colors: {
    ktp_red: "#BA2038",
    ktp_gray: "#161719",
    ktp_federal_blue: "#080A4F",
    ktp_black: "#01010F",
    ktp_delft_blue: "#243568",
    ktp_white: "#F5F4F2",
    ktp_blue_green: "#3B9EC5",
   },
   keyframes: {
    slideRight: {
     "0%": { transform: "translateX(-8px)" },
     "100%": { transform: "translateX(0px)" },
    },
    slideLeft: {
     "0%": { transform: "translateX(0px)" },
     "100%": { transform: "translateX(8px)" },
    },
    slideDown: {
     "0%": { transform: "translateY(-80px)" },
     "100%": { transform: "translateY(0px)" },
    },
    slideTop: {
     "0%": { transform: "translateY(0px)" },
     "100%": { transform: "translateY(-80px)" },
    },
    semiPulse: {
     "0%": { opacity: "1" },
     "50%": { opacity: "0.8" },
     "100%": { opacity: "1" },
    },
    "rotate-x": {
     "0%": { transform: "rotateX(0deg)", scale: "1" },
     "30%": { transform: "rotateX(180deg)", scale: "0.95" },
     "100%": { transform: "rotateX(360deg)", scale: "1" },
    },
   },
   animation: {
    slideRight: "slideRight 0.2s linear",
    slideLeft: "slideLeft 0.2s linear",
    slideDown: "slideDown 0.2s linear",
    slideTop: "slideTop 0.2s linear",
    semiPulse: "semiPulse 2s ease-in-out  infinite",
    "rotate-x": "rotate-x 1s ease ",
   },
   transform: {
    "rotate-x-45": "rotateX(45deg)",
    "rotate-x-90": "rotateX(90deg)",
    "rotate-x-180": "rotateX(180deg)",
   },
  },
 },
 darkMode: "class",
 plugins: [require("@tailwindcss/typography")],
};
