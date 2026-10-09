import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#121212",       // encre lagon - texte, fonds sombres
        sand: "#F7F5F2",      // sable chaud
        sandlight: "#FFFFFF", // sable clair - fond de page
        coral: "#E64A19",     // corail coucher de soleil - accent / CTA
        lagoon: "#B8380F",    // lagon - liens, lignes de terrain
        lagoondark: "#8A2A0B",
        palm: "#6B6B6B",      // vert palmier - accent secondaire discret
        sun: "#FF7A3D",       // jaune sable / soleil
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "6px",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
export default config;
