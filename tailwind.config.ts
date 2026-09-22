import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B2E3D",       // encre lagon - texte, fonds sombres
        sand: "#F2E4C9",      // sable chaud
        sandlight: "#FBF6EC", // sable clair - fond de page
        coral: "#E8593B",     // corail coucher de soleil - accent / CTA
        lagoon: "#12807F",    // lagon - liens, lignes de terrain
        lagoondark: "#0C5B5A",
        palm: "#2F6E4F",      // vert palmier - accent secondaire discret
        sun: "#F4A63B",       // jaune sable / soleil
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
