/** Emplacements d'images de la page d'accueil, modifiables depuis l'admin. */
export const SITE_IMAGE_SLOTS = [
  { id: "hero", label: "Bannière d'accueil (fond)", hint: "Grande photo horizontale" },
  { id: "activite-jeu-libre", label: "Activité : Jeu libre & forfaits", hint: "Format 16:10" },
  { id: "activite-coaching", label: "Activité : Coaching individuel", hint: "Format 16:10" },
  { id: "activite-evenements", label: "Activité : Événements", hint: "Format 16:10" },
  { id: "galerie-sunset", label: "Galerie : Fin de journée", hint: "Format portrait 3:4" },
  { id: "galerie-evenements", label: "Galerie : Événements", hint: "Format portrait 3:4" },
  { id: "galerie-coaching", label: "Galerie : Coaching", hint: "Format portrait 3:4" },
  { id: "galerie-equipement", label: "Galerie : Équipement", hint: "Format portrait 3:4" },
] as const;

export type SiteImageSlot = (typeof SITE_IMAGE_SLOTS)[number]["id"];

export function isSiteImageSlot(value: string): value is SiteImageSlot {
  return SITE_IMAGE_SLOTS.some((s) => s.id === value);
}
