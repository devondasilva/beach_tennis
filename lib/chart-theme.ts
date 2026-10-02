/**
 * Palette des graphiques — validée (bande de luminosité, chroma, séparation
 * daltonisme ΔE ≥ 8, plancher vision normale) avec le validateur dataviz.
 * Couleurs dérivées de la palette du projet (corail, lagon, soleil, océan) ; le corail occupe la série 1 ; la couleur suit l'entité, jamais le rang.
 */
import type { RevenueSource } from "./analytics";

export const SERIES = ["#E8593B", "#00908C", "#E39B1B", "#3A5BA0"] as const;

export const SOURCE_COLORS: Record<RevenueSource, string> = {
  terrains: SERIES[0],
  cours: SERIES[1],
  boutique: SERIES[2],
  evenements: SERIES[3],
};

export const SOURCE_ORDER: RevenueSource[] = ["terrains", "cours", "boutique", "evenements"];

/** Rampe séquentielle corail (clair → foncé) pour les intensités (heatmap). */
export const ORANGE_RAMP = ["#FDEDE8", "#F8CDBF", "#F2A68F", "#ED7F60", "#E8593B", "#12807F"];

export const CHART = {
  grid: "rgba(11,46,61,0.07)",
  axis: "#4E6670",
  text: "#0B2E3D",
  surface: "#FFFFFF",
};

export function compactFCFA(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`;
  if (v >= 1_000) return `${(v / 1_000).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} k`;
  return String(Math.round(v));
}
