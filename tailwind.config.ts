import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080c",
          900: "#0c0e14",
          800: "#12151d",
          700: "#1a1e29",
          600: "#262b3a",
        },
        reactor: {
          amber: "#f4c14a",
          mint: "#3ee0b2",
          coral: "#ff6b6b",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(244, 193, 74, 0.45)",
        mint: "0 0 60px -18px rgba(62, 224, 178, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
