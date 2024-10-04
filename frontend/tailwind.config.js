/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#030607",
        background: "#F4F8FB",
        primary: "#54A5C4",
        secondary: "#A19CDE",
        accent: "#9372CF",
      },
    },
  },
  plugins: [],
};
