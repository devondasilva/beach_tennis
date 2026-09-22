export type Level = "debutant" | "intermediaire" | "confirme";
export type PaymentMethod = "mtn_momo" | "moov_money" | "sur_place";

export interface Player {
  id: string;
  name: string;
  phone: string;
  level: Level;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  playerId: string;
  playerName: string;
  tariffId: string;
  tariffLabel: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  paymentMethod: PaymentMethod;
  status: "confirmee" | "enregistree_sur_place";
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
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  speciality: string;
}
