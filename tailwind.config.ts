import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        blue: {
          // 400: "#2589FE",
          // 500: "#0070F3",
          // 600: "#2F6FEB",
          400: "#34D399", // Tailwind green-400
          500: "#10B981", // Tailwind green-500
          600: "#059669", // Tailwind green-600
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "shimmer-rtl": {
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "shimmer-rtl": "shimmer-rtl 2s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
