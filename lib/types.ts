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
  registrations: EventRegistration[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
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

