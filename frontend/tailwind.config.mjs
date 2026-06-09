/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#101113",
        ember: "#f0b429",
        copper: "#c76d2b",
        lagoon: "#1f7a8c",
        plum: "#5b3f8c",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(240, 180, 41, 0.18)",
      },
    },
  },
  plugins: [],
};
