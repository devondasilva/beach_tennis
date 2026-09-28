export type Level = "debutant" | "intermediaire" | "confirme";
export type PaymentMethod = "mtn_momo" | "moov_money" | "sur_place";
export type BookingStatus = "confirmee" | "enregistree_sur_place" | "annulee";
export type LessonStatus = "confirme" | "annulee";
export type OrderStatus = "en_attente" | "livree" | "annulee";
export type UserRole = "admin" | "player";

export interface Player {
  id: string;
  name: string;
  phone: string;
  level: Level;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface SessionPayload {
  role: UserRole;
  id: string;
  name: string;
  exp: number;
}

export interface Booking {
  id: string;
  playerId: string;
  playerName: string;
  beachId: string;
  beachName: string;
  tariffId: string;
  tariffLabel: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
}

export interface Lesson {
  id: string;
  playerId: string;
  playerName: string;
  coach: string;
  formulaId: string;
  formulaLabel: string;
  date: string;
  time: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: LessonStatus;
  createdAt: string;
}

export interface EventRegistration {
  playerId: string;
  playerName: string;
  registeredAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  entryFee: number;
  prize: string;
  capacity: number;
  poster?: string | null; // affiche de l'événement (chemin public)
  registrations: EventRegistration[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  images: string[]; // chemins publics, ex. "/uploads/products/xxx.jpg"
}

export type AdPlacement = "accueil" | "boutique" | "evenements" | "cours";

export interface Ad {
  id: string;
  advertiser: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  createdAt: string;
}

export type ArticleCategory = "actualite" | "revue_presse";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  imageUrl: string | null;
  sourceUrl: string | null; // lien vers l'article original, pour une revue de presse
  sourceName: string | null; // nom du média, pour une revue de presse
  featured: boolean; // mis en avant sur la page d'accueil
  publishedAt: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  playerId: string;
  playerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  speciality: string;
}

export interface Beach {
  id: string;
  name: string;
  location: string;
  description: string;
  amenities: string[];
  images: string[]; // chemins publics, ex. "/uploads/beaches/xxx.jpg"
  active: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  beachId: string;
  playerId: string;
  playerName: string;
  rating: number; // 1 à 5
  comment: string;
  createdAt: string;
}

export interface BeachMonthlyStat {
  month: string; // "2026-01"
  label: string; // "Jan. 2026"
  revenue: number;
  bookings: number;
}

export interface BeachStats {
  beachId: string;
  totalRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  averageTicket: number;
  reviewsCount: number;
  averageRating: number | null;
  topTariff: { label: string; count: number } | null;
  monthly: BeachMonthlyStat[];
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}
