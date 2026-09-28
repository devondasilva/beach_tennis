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
  Ad,
  AdPlacement,
  Partner,
  Article,
  ContactMessage,
  BeachStats,
  BeachMonthlyStat,
} from "./types";
import { verifyPassword } from "./password";
import type { SiteImageSlot } from "./site-images";

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

// ---------- Homepage images ----------
export function getSiteImages(): Partial<Record<SiteImageSlot, string>> {
  return readJSON<Partial<Record<SiteImageSlot, string>>>("site-images.json");
}

export function setSiteImage(slot: SiteImageSlot, imagePath: string): string | undefined {
  const images = getSiteImages();
  const previous = images[slot];
  images[slot] = imagePath;
  writeJSON("site-images.json", images);
  return previous;
}

export function removeSiteImage(slot: SiteImageSlot): string | undefined {
  const images = getSiteImages();
  const previous = images[slot];
  delete images[slot];
  writeJSON("site-images.json", images);
  return previous;
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

export function getAdminById(id: string): Admin | undefined {
  return getAdmins().find((a) => a.id === id);
}

export function updateAdminPassword(id: string, passwordHash: string, passwordSalt: string): Admin | undefined {
  const admins = getAdmins();
  const idx = admins.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  admins[idx] = { ...admins[idx], passwordHash, passwordSalt };
  writeJSON("admins.json", admins);
  return admins[idx];
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

export function createProduct(
  product: Omit<Product, "id" | "images"> & { images?: string[] }
): Product {
  const products = getProducts();
  const full: Product = { ...product, images: product.images ?? [], id: newId("pr") };
  products.push(full);
  writeJSON("products.json", products);
  return full;
}

export function addProductImages(id: string, imagePaths: string[]): Product | undefined {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx].images = [...(products[idx].images ?? []), ...imagePaths];
  writeJSON("products.json", products);
  return products[idx];
}

export function removeProductImage(id: string, imagePath: string): Product | undefined {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx].images = (products[idx].images ?? []).filter((img) => img !== imagePath);
  writeJSON("products.json", products);
  return products[idx];
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

// ---------- Publicités (espaces annonceurs) ----------
export function getAds(): Ad[] {
  return readJSON<Ad[]>("ads.json");
}

export function getAdById(id: string): Ad | undefined {
  return getAds().find((a) => a.id === id);
}

/** Annonces actives pour un emplacement donné, dans leur fenêtre de diffusion (si définie). */
export function getActiveAdsByPlacement(placement: AdPlacement): Ad[] {
  const now = new Date();
  return getAds().filter((a) => {
    if (!a.active || a.placement !== placement) return false;
    if (a.startDate && new Date(a.startDate) > now) return false;
    if (a.endDate && new Date(a.endDate) < now) return false;
    return true;
  });
}

export function createAd(ad: Omit<Ad, "id" | "createdAt">): Ad {
  const ads = getAds();
  const full: Ad = { ...ad, id: newId("ad"), createdAt: new Date().toISOString() };
  ads.push(full);
  writeJSON("ads.json", ads);
  return full;
}

export function updateAd(id: string, patch: Partial<Omit<Ad, "id" | "createdAt">>): Ad | undefined {
  const ads = getAds();
  const idx = ads.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  ads[idx] = { ...ads[idx], ...patch };
  writeJSON("ads.json", ads);
  return ads[idx];
}

export function deleteAd(id: string): boolean {
  const ads = getAds();
  const next = ads.filter((a) => a.id !== id);
  if (next.length === ads.length) return false;
  writeJSON("ads.json", next);
  return true;
}

// ---------- Statistiques par plage ----------
const MONTH_LABELS = [
  "Jan.", "Fév.", "Mars", "Avr.", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.",
];

/**
 * Statistiques d'activité d'une plage : recettes, réservations, avis,
 * et évolution mensuelle sur les `months` derniers mois (recettes des
 * réservations de terrain, seule activité rattachée à une plage précise).
 */
export function getBeachStats(beachId: string, months = 6): BeachStats {
  const bookings = getBookings().filter((b) => b.beachId === beachId);
  const notCancelled = bookings.filter((b) => b.status !== "annulee");
  const cancelled = bookings.filter((b) => b.status === "annulee");
  const totalRevenue = notCancelled.reduce((sum, b) => sum + b.price, 0);

  const reviews = getReviewsByBeach(beachId);
  const averageRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : null;

  const tariffCounts = new Map<string, number>();
  for (const b of notCancelled) {
    tariffCounts.set(b.tariffLabel, (tariffCounts.get(b.tariffLabel) ?? 0) + 1);
  }
  let topTariff: BeachStats["topTariff"] = null;
  for (const [label, count] of tariffCounts) {
    if (!topTariff || count > topTariff.count) topTariff = { label, count };
  }

  // Fenêtre glissante des `months` derniers mois, dans l'ordre chronologique.
  const now = new Date();
  const monthly: BeachMonthlyStat[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthly.push({
      month: key,
      label: `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`,
      revenue: 0,
      bookings: 0,
    });
  }
  const monthIndex = new Map(monthly.map((m, i) => [m.month, i]));
  for (const b of notCancelled) {
    const key = b.date.slice(0, 7); // "YYYY-MM"
    const idx = monthIndex.get(key);
    if (idx !== undefined) {
      monthly[idx].revenue += b.price;
      monthly[idx].bookings += 1;
    }
  }

  return {
    beachId,
    totalRevenue,
    totalBookings: bookings.length,
    confirmedBookings: notCancelled.length,
    cancelledBookings: cancelled.length,
    averageTicket: notCancelled.length > 0 ? Math.round(totalRevenue / notCancelled.length) : 0,
    reviewsCount: reviews.length,
    averageRating,
    topTariff,
    monthly,
  };
}

// ---------- Partenaires (logos affichés sur le site) ----------
export function getPartners(): Partner[] {
  return readJSON<Partner[]>("partners.json");
}

export function createPartner(partner: Omit<Partner, "id" | "createdAt">): Partner {
  const partners = getPartners();
  const full: Partner = { ...partner, id: newId("pt"), createdAt: new Date().toISOString() };
  partners.push(full);
  writeJSON("partners.json", partners);
  return full;
}

export function deletePartner(id: string): Partner | undefined {
  const partners = getPartners();
  const found = partners.find((p) => p.id === id);
  const next = partners.filter((p) => p.id !== id);
  if (next.length === partners.length) return undefined;
  writeJSON("partners.json", next);
  return found;
}

// ---------- Actualités & revue de presse ----------
export function getArticles(): Article[] {
  return readJSON<Article[]>("articles.json")
    .map((a) => ({ ...a, featured: a.featured ?? false })) // rétrocompatible
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getArticles().filter((a) => a.featured).slice(0, limit);
}

export function getArticleById(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function createArticle(article: Omit<Article, "id" | "createdAt">): Article {
  const articles = readJSON<Article[]>("articles.json");
  const full: Article = { ...article, id: newId("art"), createdAt: new Date().toISOString() };
  articles.push(full);
  writeJSON("articles.json", articles);
  return full;
}

export function setArticleFeatured(id: string, featured: boolean): Article | undefined {
  const articles = readJSON<Article[]>("articles.json");
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  articles[idx] = { ...articles[idx], featured };
  writeJSON("articles.json", articles);
  return articles[idx];
}

export function deleteArticle(id: string): Article | undefined {
  const articles = readJSON<Article[]>("articles.json");
  const found = articles.find((a) => a.id === id);
  const next = articles.filter((a) => a.id !== id);
  if (next.length === articles.length) return undefined;
  writeJSON("articles.json", next);
  return found;
}

// ---------- Messages de contact (formulaire "Parlons de votre projet") ----------
export function getContactMessages(): ContactMessage[] {
  return readJSON<ContactMessage[]>("contact-messages.json").sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createContactMessage(
  msg: Omit<ContactMessage, "id" | "createdAt" | "read">
): ContactMessage {
  const messages = readJSON<ContactMessage[]>("contact-messages.json");
  const full: ContactMessage = {
    ...msg,
    id: newId("msg"),
    read: false,
    createdAt: new Date().toISOString(),
  };
  messages.push(full);
  writeJSON("contact-messages.json", messages);
  return full;
}

export function markContactMessageRead(id: string, read: boolean): ContactMessage | undefined {
  const messages = readJSON<ContactMessage[]>("contact-messages.json");
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  messages[idx] = { ...messages[idx], read };
  writeJSON("contact-messages.json", messages);
  return messages[idx];
}

export function deleteContactMessage(id: string): boolean {
  const messages = readJSON<ContactMessage[]>("contact-messages.json");
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  writeJSON("contact-messages.json", next);
  return true;
}
