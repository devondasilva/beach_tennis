import fs from "fs";
import path from "path";
import {
  Player,
  Booking,
  Lesson,
  EventItem,
  Product,
  Order,
  Coach,
  Level,
} from "./types";

const dataDir = path.join(process.cwd(), "data");

function readJSON<T>(file: string): T {
  const filePath = path.join(dataDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJSON<T>(file: string, value: T): void {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

// ---------- Players ----------
export function getPlayers(): Player[] {
  return readJSON<Player[]>("players.json");
}

export function getPlayerById(id: string): Player | undefined {
  return getPlayers().find((p) => p.id === id);
}

export function getPlayerByPhone(phone: string): Player | undefined {
  return getPlayers().find((p) => p.phone === phone.trim());
}

export function findOrCreatePlayer(
  name: string,
  phone: string,
  level: Level = "debutant"
): Player {
  const players = getPlayers();
  const existing = players.find((p) => p.phone === phone.trim());
  if (existing) {
    // Garde le nom le plus récent renseigné, sans écraser le niveau déjà connu
    return existing;
  }
  const player: Player = {
    id: newId("pl"),
    name: name.trim(),
    phone: phone.trim(),
    level,
    loyaltyPoints: 0,
    createdAt: new Date().toISOString(),
  };
  players.push(player);
  writeJSON("players.json", players);
  return player;
}

export function addLoyaltyPoints(playerId: string, spentAmount: number): void {
  const players = getPlayers();
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return;
  players[idx].loyaltyPoints += Math.floor(spentAmount / 100);
  writeJSON("players.json", players);
}

// ---------- Bookings ----------
export function getBookings(): Booking[] {
  return readJSON<Booking[]>("bookings.json");
}

export function createBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Booking {
  const bookings = getBookings();
  const full: Booking = {
    ...booking,
    id: newId("bk"),
    createdAt: new Date().toISOString(),
  };
  bookings.push(full);
  writeJSON("bookings.json", bookings);
  addLoyaltyPoints(booking.playerId, booking.price);
  return full;
}

// ---------- Lessons ----------
export function getLessons(): Lesson[] {
  return readJSON<Lesson[]>("lessons.json");
}

export function createLesson(lesson: Omit<Lesson, "id" | "createdAt">): Lesson {
  const lessons = getLessons();
  const full: Lesson = {
    ...lesson,
    id: newId("ls"),
    createdAt: new Date().toISOString(),
  };
  lessons.push(full);
  writeJSON("lessons.json", lessons);
  addLoyaltyPoints(lesson.playerId, lesson.price);
  return full;
}

// ---------- Events ----------
export function getEvents(): EventItem[] {
  return readJSON<EventItem[]>("events.json");
}

export function getEventById(id: string): EventItem | undefined {
  return getEvents().find((e) => e.id === id);
}

export function registerToEvent(
  eventId: string,
  playerId: string,
  playerName: string
): { ok: boolean; message: string; event?: EventItem } {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return { ok: false, message: "Événement introuvable." };
  const event = events[idx];
  if (event.registrations.some((r) => r.playerId === playerId)) {
    return { ok: false, message: "Vous êtes déjà inscrit à cet événement." };
  }
  if (event.registrations.length >= event.capacity) {
    return { ok: false, message: "Cet événement est complet." };
  }
  event.registrations.push({
    playerId,
    playerName,
    registeredAt: new Date().toISOString(),
  });
  events[idx] = event;
  writeJSON("events.json", events);
  addLoyaltyPoints(playerId, event.entryFee);
  return { ok: true, message: "Inscription confirmée.", event };
}

// ---------- Products & Orders ----------
export function getProducts(): Product[] {
  return readJSON<Product[]>("products.json");
}

export function getOrders(): Order[] {
  return readJSON<Order[]>("orders.json");
}

export function createOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const orders = getOrders();
  const full: Order = {
    ...order,
    id: newId("or"),
    createdAt: new Date().toISOString(),
  };
  orders.push(full);
  writeJSON("orders.json", orders);

  // décrémente le stock
  const products = getProducts();
  for (const item of order.items) {
    const p = products.find((pr) => pr.id === item.productId);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  }
  writeJSON("products.json", products);

  addLoyaltyPoints(order.playerId, order.total);
  return full;
}

// ---------- Coaches ----------
export function getCoaches(): Coach[] {
  return readJSON<Coach[]>("coaches.json");
}
