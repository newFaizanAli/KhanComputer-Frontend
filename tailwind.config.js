/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF2D55",
        primaryDark: "#E5194B",
        secondary: "#5E5CE6",
        accent: "#FF9500",

        dark: "#0A0A0A",
        darkGray: "#1C1C1E",
        mediumGray: "#2C2C2E",
        lightGray: "#3A3A3C",

        text: "#FFFFFF",
        textSecondary: "#8E8E93",

        success: "#34C759",
        error: "#FF3B30",

        background: "#000000",
      },

    },
  },
  plugins: [],
};
