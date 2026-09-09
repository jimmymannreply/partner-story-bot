/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dl: {
          page: "#F5F5F5",
          surface: "#FFFFFF",
          border: "#E0E0E0",
          text: "#242424",
          "text-secondary": "#616161",
          brand: "#0078D4",
          "brand-hover": "#106EBE",
          success: "#107C10",
          "success-bg": "#DFF6DD",
          warning: "#8A6116",
          "warning-bg": "#FFF4CE",
          danger: "#A4262C",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI Variable"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        "stage-active": "0 0 0 2px #0078D4, 0 4px 12px rgba(0,120,212,0.15)",
      },
      borderRadius: {
        dl: "8px",
      },
    },
  },
  plugins: [],
};
