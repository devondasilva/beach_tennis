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
        muted: "#4E6670",     // texte secondaire (encre adoucie)
        carbon: "#123B4C",    // encre éclaircie (surfaces sombres secondaires)
        // Séries des graphiques du tableau de bord (palette validée daltonisme)
        series: { 1: "#E8593B", 2: "#00908C", 3: "#E39B1B", 4: "#3A5BA0" },
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
      keyframes: {
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgba(232,89,59,.55)" },
          "70%": { boxShadow: "0 0 0 9px rgba(232,89,59,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(232,89,59,0)" },
        },
        wave: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 14s linear infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-dot": "pulse-dot 1.8s ease-out infinite",
        wave: "wave 18s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
