import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind v4 auto-detects content via @import "tailwindcss" in CSS.
  // These paths are kept as explicit fallback for compatibility.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"], // Fonte Playfair Display
        sans: ["var(--font-sans)"], // Fonte Montserrat
      },
      colors: {
        gold: {
          500: "#D9A520", // Ouro Clássico
          600: "#B8860B", // Ouro Escuro
        },
      },
    },
  },
  plugins: [],
};
export default config;
