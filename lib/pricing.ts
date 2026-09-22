export interface Tariff {
  id: string;
  label: string;
  detail: string;
  price: number;
}

// Grille tarifaire alignée sur le business plan : tarif de base 1000 FCFA / 30 min,
// forfaits dégressifs pour les groupes et familles.
export const TARIFFS: Tariff[] = [
  {
    id: "decouverte",
    label: "Séance découverte",
    detail: "1 personne · 30 min",
    price: 1000,
  },
  {
    id: "standard",
    label: "Séance standard",
    detail: "1 personne · 1h",
    price: 1800,
  },
  {
    id: "duo",
    label: "Forfait duo",
    detail: "2 personnes · 1h",
    price: 3000,
  },
  {
    id: "famille",
    label: "Forfait famille",
    detail: "3 à 4 personnes · 1h",
    price: 5200,
  },
  {
    id: "groupe",
    label: "Forfait groupe",
    detail: "5 à 6 personnes · 1h",
    price: 7200,
  },
];

export const LESSON_TARIFFS: Tariff[] = [
  {
    id: "individuel",
    label: "Cours particulier",
    detail: "1 personne · 1h",
    price: 6000,
  },
  {
    id: "groupe",
    label: "Cours en petit groupe",
    detail: "2 à 4 personnes · 1h · par personne",
    price: 4000,
  },
];

export function findTariff(id: string, list: Tariff[] = TARIFFS): Tariff | undefined {
  return list.find((t) => t.id === id);
}

export function formatFCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR").replace(/\u202f/g, " ")} FCFA`;
}

// Créneaux disponibles : l'activité tourne surtout le week-end (vendredi soir,
// samedi, dimanche) ; les autres jours sont réservés aux cours particuliers.
export const PLAY_SLOTS = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
export const LESSON_SLOTS = ["09:00", "10:00", "16:00", "17:00", "18:00"];

export function isWeekendFriendlyDate(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay(); // 0 dimanche, 5 vendredi, 6 samedi
  return day === 0 || day === 5 || day === 6;
}
