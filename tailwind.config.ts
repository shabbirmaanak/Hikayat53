import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hikayat: {
          bg: "#FBF9F5",
          surface: "#FFFFFF",
          surfaceMuted: "#F4F1EA",
          border: "#E7E2D8",
          borderHover: "#D5CEC2",
          ink: "#1A1918",
          inkMuted: "#636059",
          inkFaint: "#9C978D",
          amber: "#B45309",
          amberLight: "#FEF3C7",
          amberGold: "#C2873E",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Amiri", "Noto Naskh Arabic", "Traditional Arabic", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
