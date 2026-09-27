export interface AdminBooking {
  id: string;
  playerName: string;
  beachName: string;
  tariffLabel: string;
  date: string;
  time: string;
  price: number;
  status: "confirmee" | "enregistree_sur_place" | "annulee";
}

export interface AdminLesson {
  id: string;
  playerName: string;
  formulaLabel: string;
  coach: string;
  date: string;
  time: string;
  price: number;
  status: "confirme" | "annulee";
}

export interface AdminOrder {
  id: string;
  playerName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "en_attente" | "livree" | "annulee";
}

export interface AdminEventRegistration {
  playerId: string;
  playerName: string;
}

export interface AdminEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  entryFee: number;
  prize: string;
  capacity: number;
  registrations: AdminEventRegistration[];
}

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
}

export interface AdminAd {
  id: string;
  advertiser: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: "accueil" | "boutique" | "evenements" | "cours";
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface AdminPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  createdAt: string;
}

export interface AdminArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "actualite" | "revue_presse";
  imageUrl: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface AdminPlayer {
  id: string;
  name: string;
  phone: string;
  level: "debutant" | "intermediaire" | "confirme";
  loyaltyPoints: number;
}

export interface Stats {
  totals: {
    players: number;
    bookings: number;
    lessons: number;
    orders: number;
    eventRegistrations: number;
    revenueBookings: number;
    revenueLessons: number;
    revenueOrders: number;
    revenueEvents: number;
    totalRevenue: number;
  };
  bookings: AdminBooking[];
  lessons: AdminLesson[];
  orders: AdminOrder[];
  events: AdminEvent[];
  players: AdminPlayer[];
  products: AdminProduct[];
}
