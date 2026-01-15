import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"], // Fonte Playfair Display
        sans: ["var(--font-sans)"],   // Fonte Lato
      },
      colors: {
        gold: {
          500: "#D9A520", // Ouro Clássico
          600: "#B8860B", // Ouro Escuro
        }
      }
    },
  },
  plugins: [],
};
export default config;