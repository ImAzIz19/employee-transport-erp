/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        signalRed: "#FF1212",
        signalYellow: "#FDF63A",
        signalGreen: "#67CA4E",
        corporateBlue: "#002857",
        accentLightBlue: "#00B2FF",
        accentOrange: "#FF7514",
        accentBlue: "#0064C8",
      }
    },
  },
  plugins: [],
}