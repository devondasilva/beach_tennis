import fs from "fs";
import path from "path";
import {
  Player,
  Booking,
  BookingStatus,
  Lesson,
  LessonStatus,
  EventItem,
  Product,
  Order,
  OrderStatus,
  Coach,
  Admin,
  Level,
  Beach,
  Review,
} from "./types";
import { verifyPassword } from "./password";

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

// ---------- Admins ----------
export function getAdmins(): Admin[] {
  return readJSON<Admin[]>("admins.json");
}

export function verifyAdminCredentials(username: string, password: string): Admin | null {
  const admin = getAdmins().find((a) => a.username === username.trim());
  if (!admin) return null;
  const ok = verifyPassword(password, admin.passwordHash, admin.passwordSalt);
  return ok ? admin : null;
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

/** Ajustement manuel des points par un administrateur (peut être négatif). */
export function adjustPlayerPointsManually(
  playerId: string,
  delta: number
): Player | undefined {
  const players = getPlayers();
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return undefined;
  players[idx].loyaltyPoints = Math.max(0, players[idx].loyaltyPoints + delta);
  writeJSON("players.json", players);
  return players[idx];
}

export function updatePlayerLevel(playerId: string, level: Level): Player | undefined {
  const players = getPlayers();
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx === -1) return undefined;
  players[idx].level = level;
  writeJSON("players.json", players);
  return players[idx];
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

export function updateBookingStatus(
  id: string,
  status: BookingStatus
): Booking | undefined {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  bookings[idx].status = status;
  writeJSON("bookings.json", bookings);
  return bookings[idx];
}

// ---------- Lessons ----------
export function getLessons(): Lesson[] {
  return readJSON<Lesson[]>("lessons.json");
}

export function createLesson(
  lesson: Omit<Lesson, "id" | "createdAt" | "status"> & { status?: LessonStatus }
): Lesson {
  const lessons = getLessons();
  const full: Lesson = {
    ...lesson,
    status: lesson.status ?? "confirme",
    id: newId("ls"),
    createdAt: new Date().toISOString(),
  };
  lessons.push(full);
  writeJSON("lessons.json", lessons);
  addLoyaltyPoints(lesson.playerId, lesson.price);
  return full;
}

export function updateLessonStatus(id: string, status: LessonStatus): Lesson | undefined {
  const lessons = getLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx === -1) return undefined;
  lessons[idx].status = status;
  writeJSON("lessons.json", lessons);
  return lessons[idx];
}

// ---------- Events ----------
export function getEvents(): EventItem[] {
  return readJSON<EventItem[]>("events.json");
}

export function getEventById(id: string): EventItem | undefined {
  return getEvents().find((e) => e.id === id);
}

export function createEvent(
  event: Omit<EventItem, "id" | "registrations">
): EventItem {
  const events = getEvents();
  const full: EventItem = { ...event, id: newId("evt"), registrations: [] };
  events.push(full);
  writeJSON("events.json", events);
  return full;
}

export function updateEvent(
  id: string,
  patch: Partial<Omit<EventItem, "id" | "registrations">>
): EventItem | undefined {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  events[idx] = { ...events[idx], ...patch };
  writeJSON("events.json", events);
  return events[idx];
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const next = events.filter((e) => e.id !== id);
  if (next.length === events.length) return false;
  writeJSON("events.json", next);
  return true;
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

export function removeEventRegistration(
  eventId: string,
  playerId: string
): EventItem | undefined {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx === -1) return undefined;
  events[idx].registrations = events[idx].registrations.filter(
    (r) => r.playerId !== playerId
  );
  writeJSON("events.json", events);
  return events[idx];
}

// ---------- Products & Orders ----------
export function getProducts(): Product[] {
  return readJSON<Product[]>("products.json");
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function createProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const full: Product = { ...product, id: newId("pr") };
  products.push(full);
  writeJSON("products.json", products);
  return full;
}

export function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id">>
): Product | undefined {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...patch };
  writeJSON("products.json", products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  writeJSON("products.json", next);
  return true;
}

export function getOrders(): Order[] {
  return readJSON<Order[]>("orders.json");
}

export function createOrder(
  order: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }
): Order {
  const orders = getOrders();
  const full: Order = {
    ...order,
    status: order.status ?? "en_attente",
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

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx].status = status;
  writeJSON("orders.json", orders);
  return orders[idx];
}

// ---------- Coaches ----------
export function getCoaches(): Coach[] {
  return readJSON<Coach[]>("coaches.json");
}

// ---------- Beaches (plages / espaces) ----------
export function getBeaches(): Beach[] {
  return readJSON<Beach[]>("beaches.json");
}

export function getBeachById(id: string): Beach | undefined {
  return getBeaches().find((b) => b.id === id);
}

export function createBeach(
  beach: Omit<Beach, "id" | "createdAt" | "images"> & { images?: string[] }
): Beach {
  const beaches = getBeaches();
  const full: Beach = {
    ...beach,
    images: beach.images ?? [],
    id: newId("bch"),
    createdAt: new Date().toISOString(),
  };
  beaches.push(full);
  writeJSON("beaches.json", beaches);
  return full;
}

export function updateBeach(
  id: string,
  patch: Partial<Omit<Beach, "id" | "createdAt">>
): Beach | undefined {
  const beaches = getBeaches();
  const idx = beaches.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  beaches[idx] = { ...beaches[idx], ...patch };
  writeJSON("beaches.json", beaches);
  return beaches[idx];
}

export function addBeachImages(id: string, imagePaths: string[]): Beach | undefined {
  const beaches = getBeaches();
  const idx = beaches.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  beaches[idx].images = [...beaches[idx].images, ...imagePaths];
  writeJSON("beaches.json", beaches);
  return beaches[idx];
}

export function removeBeachImage(id: string, imagePath: string): Beach | undefined {
  const beaches = getBeaches();
  const idx = beaches.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  beaches[idx].images = beaches[idx].images.filter((img) => img !== imagePath);
  writeJSON("beaches.json", beaches);
  return beaches[idx];
}

export function deleteBeach(id: string): boolean {
  const beaches = getBeaches();
  const next = beaches.filter((b) => b.id !== id);
  if (next.length === beaches.length) return false;
  writeJSON("beaches.json", next);
  // Les avis liés à cette plage n'ont plus de sens : on les retire aussi.
  const reviews = getReviews().filter((r) => r.beachId !== id);
  writeJSON("reviews.json", reviews);
  return true;
}

// ---------- Avis ----------
export function getReviews(): Review[] {
  return readJSON<Review[]>("reviews.json");
}

export function getReviewsByBeach(beachId: string): Review[] {
  return getReviews()
    .filter((r) => r.beachId === beachId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getBeachRating(beachId: string): { average: number; count: number } {
  const reviews = getReviewsByBeach(beachId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}

export function createReview(
  review: Omit<Review, "id" | "createdAt">
): Review {
  const reviews = getReviews();
  const full: Review = {
    ...review,
    id: newId("rv"),
    createdAt: new Date().toISOString(),
  };
  reviews.push(full);
  writeJSON("reviews.json", reviews);
  return full;
}

export function deleteReview(id: string): boolean {
  const reviews = getReviews();
  const next = reviews.filter((r) => r.id !== id);
  if (next.length === reviews.length) return false;
  writeJSON("reviews.json", next);
  return true;
}
