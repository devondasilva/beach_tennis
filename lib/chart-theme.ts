/**
 * Palette des graphiques — identité MADES, validée (bande de luminosité,
 * chroma, séparation daltonisme ΔE ≥ 8, plancher vision normale).
 * L'orange MADES occupe la série 1 ; la couleur suit l'entité, jamais le rang.
 */
import type { RevenueSource } from "./analytics";

export const SERIES = ["#FF4D00", "#2A78D6", "#1BAF7A", "#4A3AA7"] as const;

export const SOURCE_COLORS: Record<RevenueSource, string> = {
  terrains: SERIES[0],
  cours: SERIES[1],
  boutique: SERIES[2],
  evenements: SERIES[3],
};

export const SOURCE_ORDER: RevenueSource[] = ["terrains", "cours", "boutique", "evenements"];

/** Rampe séquentielle orange (clair → foncé) pour les intensités (heatmap). */
export const ORANGE_RAMP = ["#FFF1EA", "#FFD3BD", "#FFAE85", "#FF844D", "#FF4D00", "#C23A00"];

export const CHART = {
  grid: "rgba(10,10,8,0.07)",
  axis: "#666660",
  text: "#0A0A08",
  surface: "#FFFFFF",
};

export function compactFCFA(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  if (v >= 1_000) return `${(v / 1_000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} k`;
  return String(Math.round(v));
}
