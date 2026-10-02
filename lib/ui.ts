/**
 * Classes partagées du design Beach Tennis Bénin — reprises de la page
 * d'accueil (boutons arrondis en capitales, cartes blanches très arrondies,
 * champs épais) pour que toutes les pages parlent la même langue visuelle.
 */
export const ui = {
  btnPrimary:
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-coral text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-2xl shadow-lg shadow-coral/20 hover:bg-sun hover:text-ink transition-all disabled:opacity-60 disabled:pointer-events-none",
  btnDark:
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-ink text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:bg-coral transition-all disabled:opacity-60 disabled:pointer-events-none",
  btnSun:
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-sun text-ink font-bold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:bg-white transition-all",
  btnGhost:
    "inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-ink/10 bg-white text-ink font-bold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:border-coral hover:text-coral transition-all",
  btnGhostDark:
    "inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all",
  card: "bg-white border border-ink/[0.08] rounded-[2rem] shadow-sm",
  cardHover:
    "bg-white border border-ink/[0.08] rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-coral/10 hover:-translate-y-1 transition-all duration-300",
  label: "block text-[11px] font-bold uppercase tracking-widest text-ink/60 mb-2",
  input:
    "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 font-semibold text-ink placeholder:text-ink/35 placeholder:font-medium focus:border-coral focus:outline-none transition-colors",
  eyebrow: "text-[11px] font-bold uppercase tracking-[0.25em] text-coral",
  sectionTitle: "font-display text-3xl md:text-4xl font-black tracking-tight text-ink",
  error: "text-sm font-semibold text-coral bg-coral/10 rounded-2xl px-4 py-3",
} as const;

/** Classe d'une carte-option (radio stylé) selon son état. */
export function optionCls(selected: boolean, tone: "coral" | "lagoon" = "coral") {
  const on =
    tone === "coral"
      ? "border-coral bg-coral/[0.06] shadow-lg shadow-coral/10"
      : "border-lagoon bg-lagoon/[0.06] shadow-lg shadow-lagoon/10";
  return `relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
    selected ? on : "border-ink/10 bg-white hover:border-ink/25"
  }`;
}
