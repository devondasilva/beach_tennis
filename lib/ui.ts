/**
 * Classes partagées du design Beach Tennis Bénin × MADES — reprises de la
 * page d'accueil (boutons « pilule », cartes blanches arrondies, champs épais) pour que toutes les pages parlent la même langue visuelle.
 */
export const ui = {
  btnPrimary:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-orange text-white font-semibold text-sm rounded-full shadow-glow hover:bg-ink transition-colors duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
  btnDark:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-ink text-white font-semibold text-sm rounded-full hover:bg-orange transition-colors duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
  btnSun:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-ink font-semibold text-sm rounded-full hover:bg-orange hover:text-white transition-colors duration-300",
  btnGhost:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-ink/15 bg-transparent text-ink font-semibold text-sm rounded-full hover:border-orange hover:bg-orange hover:text-white transition-colors duration-300",
  btnGhostDark:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/25 text-white font-semibold text-sm rounded-full hover:border-white hover:bg-white/15 transition-colors duration-300",
  card: "card",
  cardHover:
    "card transition-all duration-500 hover:-translate-y-1 hover:border-orange hover:shadow-lift",
  label: "field-label",
  input: "field",
  eyebrow: "tag-label",
  sectionTitle: "h-display text-4xl md:text-5xl text-ink",
  error: "text-sm font-semibold text-danger bg-danger/10 rounded-xl px-4 py-3",
} as const;

/** Classe d'une carte-option (radio stylé) selon son état. */
export function optionCls(selected: boolean, tone: "coral" | "lagoon" = "coral") {
  const on =
    tone === "coral"
      ? "border-orange bg-orangeL/60 shadow-glow"
      : "border-orangeD bg-orangeL/60 shadow-glow";
  return `relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
    selected ? on : "border-line bg-white hover:border-ink/25"
  }`;
}
