/**
 * Moteur de statistiques du back-office.
 *
 * Tout est calculé côté serveur à partir de la couche `lib/db.ts`, pour une
 * période donnée, avec comparaison à la période précédente de même durée.
 * Les composants du tableau de bord ne font que de l'affichage.
 */
import {
  getBookings,
  getLessons,
  getOrders,
  getEvents,
  getPlayers,
  getProducts,
  getBeaches,
  getReviews,
  getContactMessages,
} from "./db";
import type { Level, PaymentMethod } from "./types";

export type RangeKey = "7d" | "30d" | "90d" | "12m" | "all";
export type Granularity = "day" | "week" | "month";
export type RevenueSource = "terrains" | "cours" | "boutique" | "evenements";

export const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "7 derniers jours",
  "30d": "30 derniers jours",
  "90d": "90 derniers jours",
  "12m": "12 derniers mois",
  all: "Depuis le début",
};

export const SOURCE_LABELS: Record<RevenueSource, string> = {
  terrains: "Terrains",
  cours: "Cours",
  boutique: "Boutique",
  evenements: "Événements",
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  mtn_momo: "MTN MoMo",
  moov_money: "Moov Money",
  sur_place: "Sur place",
};

const LEVEL_LABELS: Record<Level, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
// Lundi en premier (usage français)
export const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export interface Kpi {
  value: number;
  previous: number;
  /** Variation relative (0.12 = +12 %), null si pas de base de comparaison. */
  delta: number | null;
  spark: number[];
}

export interface Bucket {
  key: string;
  label: string;
  start: number;
  end: number;
}

export interface Analytics {
  range: { key: RangeKey; label: string; from: string; to: string; granularity: Granularity };
  kpis: {
    revenue: Kpi;
    bookings: Kpi;
    lessons: Kpi;
    orders: Kpi;
    eventRegistrations: Kpi;
    newPlayers: Kpi;
    activePlayers: Kpi;
    avgTicket: Kpi;
    cancellationRate: Kpi;
  };
  revenueSeries: ({ key: string; label: string; total: number } & Record<RevenueSource, number>)[];
  revenueBySource: { source: RevenueSource; label: string; value: number; previous: number }[];
  bookingsByBeach: { beachId: string; name: string; bookings: number; revenue: number; rating: number | null; reviews: number }[];
  tariffMix: { label: string; count: number; revenue: number }[];
  paymentMix: { method: PaymentMethod; label: string; count: number; amount: number }[];
  heatmap: { hours: string[]; days: string[]; cells: number[][]; max: number };
  playersGrowth: { key: string; label: string; newPlayers: number; cumulative: number }[];
  levels: { level: Level; label: string; count: number }[];
  topPlayers: { id: string; name: string; level: Level; points: number; spent: number; visits: number }[];
  coaches: { name: string; lessons: number; revenue: number }[];
  topProducts: { id: string; name: string; qty: number; revenue: number; stock: number }[];
  lowStock: { id: string; name: string; stock: number }[];
  events: { id: string; title: string; date: string; registrations: number; capacity: number; fill: number; revenue: number; upcoming: boolean }[];
  activity: { type: "booking" | "lesson" | "order" | "event" | "player"; title: string; detail: string; amount: number | null; at: string }[];
  alerts: { unreadMessages: number; pendingOrders: number; lowStock: number; upcomingEvents: number };
}

/* ------------------------------------------------------------------ */
/*  Outils de dates                                                    */
/* ------------------------------------------------------------------ */

const DAY = 86_400_000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** "2026-09-25" (+ "16:00") → timestamp local. */
function ts(date: string, time = "12:00") {
  return new Date(`${date}T${time}:00`).getTime();
}

function granularityFor(key: RangeKey, spanDays: number): Granularity {
  if (key === "7d" || key === "30d") return "day";
  if (key === "90d") return "week";
  return spanDays <= 62 ? "day" : spanDays <= 200 ? "week" : "month";
}

function buildBuckets(from: number, to: number, g: Granularity): Bucket[] {
  const buckets: Bucket[] = [];
  let cursor = new Date(from);
  if (g === "month") cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  if (g === "week") {
    const dow = (cursor.getDay() + 6) % 7; // lundi = 0
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - dow);
  }
  while (cursor.getTime() <= to) {
    const start = cursor.getTime();
    let next: Date;
    let label: string;
    if (g === "day") {
      next = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
      label = `${cursor.getDate()} ${MONTHS[cursor.getMonth()]}`;
    } else if (g === "week") {
      next = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 7);
      label = `Sem. ${cursor.getDate()} ${MONTHS[cursor.getMonth()]}`;
    } else {
      next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      label = `${MONTHS[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}`;
    }
    buckets.push({ key: new Date(start).toISOString().slice(0, 10), label, start, end: next.getTime() });
    cursor = next;
  }
  return buckets;
}

function bucketIndex(buckets: Bucket[], t: number) {
  // Recherche binaire : les seaux sont triés et contigus.
  let lo = 0;
  let hi = buckets.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (t < buckets[mid].start) hi = mid - 1;
    else if (t >= buckets[mid].end) lo = mid + 1;
    else return mid;
  }
  return -1;
}

function kpi(value: number, previous: number, spark: number[]): Kpi {
  return {
    value,
    previous,
    delta: previous > 0 ? (value - previous) / previous : value > 0 ? null : 0,
    spark,
  };
}

/* ------------------------------------------------------------------ */
/*  Calcul principal                                                   */
/* ------------------------------------------------------------------ */

export function computeAnalytics(rangeKey: RangeKey = "30d", now = new Date()): Analytics {
  const bookings = getBookings();
  const lessons = getLessons();
  const orders = getOrders();
  const events = getEvents();
  const players = getPlayers();
  const products = getProducts();
  const beaches = getBeaches();
  const reviews = getReviews();
  const messages = getContactMessages();

  // Mouvements financiers normalisés : une ligne = un encaissement daté.
  type Tx = { t: number; amount: number; source: RevenueSource; playerId: string; cancelled: boolean };
  const txs: Tx[] = [
    ...bookings.map((b) => ({ t: ts(b.date, b.time), amount: b.price, source: "terrains" as const, playerId: b.playerId, cancelled: b.status === "annulee" })),
    ...lessons.map((l) => ({ t: ts(l.date, l.time), amount: l.price, source: "cours" as const, playerId: l.playerId, cancelled: l.status === "annulee" })),
    ...orders.map((o) => ({ t: new Date(o.createdAt).getTime(), amount: o.total, source: "boutique" as const, playerId: o.playerId, cancelled: o.status === "annulee" })),
    ...events.flatMap((e) =>
      e.registrations.map((r) => ({ t: new Date(r.registeredAt).getTime(), amount: e.entryFee, source: "evenements" as const, playerId: r.playerId, cancelled: false }))
    ),
  ];

  // Bornes de la période
  const to = startOfDay(now).getTime() + DAY - 1;
  let from: number;
  if (rangeKey === "7d") from = to + 1 - 7 * DAY;
  else if (rangeKey === "30d") from = to + 1 - 30 * DAY;
  else if (rangeKey === "90d") from = to + 1 - 90 * DAY;
  else if (rangeKey === "12m") from = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1).getTime();
  else {
    const all = [...txs.map((x) => x.t), ...players.map((p) => new Date(p.createdAt).getTime())].filter((t) => t <= to);
    from = all.length ? startOfDay(new Date(Math.min(...all))).getTime() : to + 1 - 30 * DAY;
  }
  const span = to + 1 - from;
  const prevFrom = from - span;
  const prevTo = from - 1;
  const g = granularityFor(rangeKey, span / DAY);
  const buckets = buildBuckets(from, to, g);

  const inRange = (t: number) => t >= from && t <= to;
  const inPrev = (t: number) => t >= prevFrom && t <= prevTo;

  /* ---------- Séries de recettes ---------- */
  const revenueSeries = buckets.map((b) => ({ key: b.key, label: b.label, total: 0, terrains: 0, cours: 0, boutique: 0, evenements: 0 }));
  const bySource: Record<RevenueSource, number> = { terrains: 0, cours: 0, boutique: 0, evenements: 0 };
  const bySourcePrev: Record<RevenueSource, number> = { terrains: 0, cours: 0, boutique: 0, evenements: 0 };
  const activeNow = new Set<string>();
  const activePrev = new Set<string>();
  let paidCount = 0;
  let paidCountPrev = 0;

  for (const x of txs) {
    if (x.cancelled) continue;
    if (inRange(x.t)) {
      bySource[x.source] += x.amount;
      paidCount++;
      activeNow.add(x.playerId);
      const i = bucketIndex(buckets, x.t);
      if (i >= 0) {
        revenueSeries[i][x.source] += x.amount;
        revenueSeries[i].total += x.amount;
      }
    } else if (inPrev(x.t)) {
      bySourcePrev[x.source] += x.amount;
      paidCountPrev++;
      activePrev.add(x.playerId);
    }
  }
  const revenue = Object.values(bySource).reduce((a, b) => a + b, 0);
  const revenuePrev = Object.values(bySourcePrev).reduce((a, b) => a + b, 0);

  /* ---------- Compteurs par période + mini-courbes ---------- */
  function countSeries<T>(items: T[], getT: (it: T) => number, keep: (it: T) => boolean = () => true) {
    const spark = buckets.map(() => 0);
    let cur = 0;
    let prev = 0;
    for (const it of items) {
      if (!keep(it)) continue;
      const t = getT(it);
      if (inRange(t)) {
        cur++;
        const i = bucketIndex(buckets, t);
        if (i >= 0) spark[i]++;
      } else if (inPrev(t)) prev++;
    }
    return kpi(cur, prev, spark);
  }

  const notCancelledBooking = (b: (typeof bookings)[number]) => b.status !== "annulee";
  const bookingsKpi = countSeries(bookings, (b) => ts(b.date, b.time), notCancelledBooking);
  const lessonsKpi = countSeries(lessons, (l) => ts(l.date, l.time), (l) => l.status !== "annulee");
  const ordersKpi = countSeries(orders, (o) => new Date(o.createdAt).getTime(), (o) => o.status !== "annulee");
  const regs = events.flatMap((e) => e.registrations);
  const regsKpi = countSeries(regs, (r) => new Date(r.registeredAt).getTime());
  const newPlayersKpi = countSeries(players, (p) => new Date(p.createdAt).getTime());

  const bookingsAll = bookings.filter((b) => inRange(ts(b.date, b.time)));
  const bookingsAllPrev = bookings.filter((b) => inPrev(ts(b.date, b.time)));
  const cancelRate = (list: typeof bookings) =>
    list.length ? list.filter((b) => b.status === "annulee").length / list.length : 0;

  const avgSpark = revenueSeries.map((r, i) => {
    const n = bookingsKpi.spark[i] + lessonsKpi.spark[i] + ordersKpi.spark[i] + regsKpi.spark[i];
    return n ? Math.round(r.total / n) : 0;
  });

  const kpis: Analytics["kpis"] = {
    revenue: kpi(revenue, revenuePrev, revenueSeries.map((r) => r.total)),
    bookings: bookingsKpi,
    lessons: lessonsKpi,
    orders: ordersKpi,
    eventRegistrations: regsKpi,
    newPlayers: newPlayersKpi,
    activePlayers: kpi(activeNow.size, activePrev.size, []),
    avgTicket: kpi(paidCount ? Math.round(revenue / paidCount) : 0, paidCountPrev ? Math.round(revenuePrev / paidCountPrev) : 0, avgSpark),
    cancellationRate: kpi(cancelRate(bookingsAll), cancelRate(bookingsAllPrev), []),
  };

  const revenueBySource = (Object.keys(bySource) as RevenueSource[]).map((s) => ({
    source: s,
    label: SOURCE_LABELS[s],
    value: bySource[s],
    previous: bySourcePrev[s],
  }));

  /* ---------- Plages ---------- */
  const beachMap = new Map<string, Analytics["bookingsByBeach"][number]>();
  for (const b of beaches) beachMap.set(b.id, { beachId: b.id, name: b.name, bookings: 0, revenue: 0, rating: null, reviews: 0 });
  for (const b of bookingsAll) {
    if (b.status === "annulee") continue;
    // Réservation rattachée à un ancien identifiant : on la regroupe avec la plage du même nom.
    const norm = (x: string) => x.trim().toLowerCase();
    const key = beachMap.has(b.beachId)
      ? b.beachId
      : beaches.find((x) => norm(x.name) === norm(b.beachName))?.id ?? b.beachId;
    const row = beachMap.get(key) ?? { beachId: key, name: b.beachName, bookings: 0, revenue: 0, rating: null, reviews: 0 };
    row.bookings++;
    row.revenue += b.price;
    beachMap.set(key, row);
  }
  for (const row of beachMap.values()) {
    const rv = reviews.filter((r) => r.beachId === row.beachId);
    row.reviews = rv.length;
    row.rating = rv.length ? Math.round((rv.reduce((s, r) => s + r.rating, 0) / rv.length) * 10) / 10 : null;
  }
  const bookingsByBeach = [...beachMap.values()].sort((a, b) => b.revenue - a.revenue);

  /* ---------- Formules & paiements ---------- */
  const tariffs = new Map<string, { label: string; count: number; revenue: number }>();
  const payments = new Map<PaymentMethod, { count: number; amount: number }>();
  for (const b of bookingsAll) {
    if (b.status === "annulee") continue;
    const label = b.tariffLabel.replace(/\s*\(.*\)\s*$/, "");
    const t = tariffs.get(label) ?? { label, count: 0, revenue: 0 };
    t.count++;
    t.revenue += b.price;
    tariffs.set(label, t);
  }
  for (const item of [...bookingsAll, ...lessons.filter((l) => inRange(ts(l.date, l.time)))]) {
    if (item.status === "annulee") continue;
    const p = payments.get(item.paymentMethod) ?? { count: 0, amount: 0 };
    p.count++;
    p.amount += item.price;
    payments.set(item.paymentMethod, p);
  }
  const tariffMix = [...tariffs.values()].sort((a, b) => b.count - a.count);
  const paymentMix = (Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((m) => ({
    method: m,
    label: PAYMENT_LABELS[m],
    count: payments.get(m)?.count ?? 0,
    amount: payments.get(m)?.amount ?? 0,
  }));

  /* ---------- Affluence jour × heure ---------- */
  const hourSet = new Set<string>();
  for (const b of bookingsAll) hourSet.add(b.time);
  for (const l of lessons) if (inRange(ts(l.date, l.time))) hourSet.add(l.time);
  const hours = [...hourSet].sort();
  const cells = WEEKDAYS.map(() => hours.map(() => 0));
  const addCell = (date: string, time: string) => {
    const dow = (new Date(`${date}T12:00:00`).getDay() + 6) % 7;
    const h = hours.indexOf(time);
    if (h >= 0) cells[dow][h]++;
  };
  for (const b of bookingsAll) if (b.status !== "annulee") addCell(b.date, b.time);
  for (const l of lessons) if (l.status !== "annulee" && inRange(ts(l.date, l.time))) addCell(l.date, l.time);
  const heatMax = Math.max(0, ...cells.flat());

  /* ---------- Joueurs ---------- */
  const sortedPlayers = [...players].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let cumulative = sortedPlayers.filter((p) => new Date(p.createdAt).getTime() < from).length;
  const playersGrowth = buckets.map((b) => {
    const n = sortedPlayers.filter((p) => {
      const t = new Date(p.createdAt).getTime();
      return t >= b.start && t < b.end;
    }).length;
    cumulative += n;
    return { key: b.key, label: b.label, newPlayers: n, cumulative };
  });

  const levels = (Object.keys(LEVEL_LABELS) as Level[]).map((l) => ({
    level: l,
    label: LEVEL_LABELS[l],
    count: players.filter((p) => p.level === l).length,
  }));

  const spentBy = new Map<string, { spent: number; visits: number }>();
  for (const x of txs) {
    if (x.cancelled || !inRange(x.t)) continue;
    const s = spentBy.get(x.playerId) ?? { spent: 0, visits: 0 };
    s.spent += x.amount;
    s.visits += 1;
    spentBy.set(x.playerId, s);
  }
  const topPlayers = players
    .map((p) => ({
      id: p.id,
      name: p.name,
      level: p.level,
      points: p.loyaltyPoints,
      spent: spentBy.get(p.id)?.spent ?? 0,
      visits: spentBy.get(p.id)?.visits ?? 0,
    }))
    .sort((a, b) => b.spent - a.spent || b.points - a.points)
    .slice(0, 6);

  /* ---------- Coachs ---------- */
  const coachMap = new Map<string, { name: string; lessons: number; revenue: number }>();
  for (const l of lessons) {
    if (l.status === "annulee" || !inRange(ts(l.date, l.time))) continue;
    const c = coachMap.get(l.coach) ?? { name: l.coach, lessons: 0, revenue: 0 };
    c.lessons++;
    c.revenue += l.price;
    coachMap.set(l.coach, c);
  }
  const coaches = [...coachMap.values()].sort((a, b) => b.lessons - a.lessons);

  /* ---------- Boutique ---------- */
  const prodMap = new Map<string, { id: string; name: string; qty: number; revenue: number; stock: number }>();
  for (const p of products) prodMap.set(p.id, { id: p.id, name: p.name, qty: 0, revenue: 0, stock: p.stock });
  for (const o of orders) {
    if (o.status === "annulee" || !inRange(new Date(o.createdAt).getTime())) continue;
    for (const it of o.items) {
      const row = prodMap.get(it.productId) ?? { id: it.productId, name: it.name, qty: 0, revenue: 0, stock: 0 };
      row.qty += it.qty;
      row.revenue += it.qty * it.price;
      prodMap.set(it.productId, row);
    }
  }
  const topProducts = [...prodMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  const lowStock = products.filter((p) => p.stock <= 5).map((p) => ({ id: p.id, name: p.name, stock: p.stock })).sort((a, b) => a.stock - b.stock);

  /* ---------- Événements ---------- */
  const today = startOfDay(now).getTime();
  const eventRows = events
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      registrations: e.registrations.length,
      capacity: e.capacity,
      fill: e.capacity ? e.registrations.length / e.capacity : 0,
      revenue: e.registrations.length * e.entryFee,
      upcoming: ts(e.date) >= today,
    }))
    .sort((a, b) => Number(b.upcoming) - Number(a.upcoming) || (a.upcoming ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  /* ---------- Fil d'activité ---------- */
  const activity: Analytics["activity"] = [
    ...bookings.map((b) => ({ type: "booking" as const, title: `${b.playerName} a réservé un terrain`, detail: `${b.beachName} · ${b.date} ${b.time}`, amount: b.status === "annulee" ? null : b.price, at: b.createdAt })),
    ...lessons.map((l) => ({ type: "lesson" as const, title: `${l.playerName} a réservé un cours`, detail: `${l.coach} · ${l.date} ${l.time}`, amount: l.status === "annulee" ? null : l.price, at: l.createdAt })),
    ...orders.map((o) => ({ type: "order" as const, title: `Commande de ${o.playerName}`, detail: o.items.map((i) => `${i.qty}× ${i.name}`).join(", "), amount: o.status === "annulee" ? null : o.total, at: o.createdAt })),
    ...events.flatMap((e) => e.registrations.map((r) => ({ type: "event" as const, title: `${r.playerName} inscrit·e`, detail: e.title, amount: e.entryFee, at: r.registeredAt }))),
    ...players.map((p) => ({ type: "player" as const, title: `Nouveau joueur : ${p.name}`, detail: LEVEL_LABELS[p.level], amount: null, at: p.createdAt })),
  ]
    .filter((a) => new Date(a.at).getTime() <= now.getTime())
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 12);

  return {
    range: {
      key: rangeKey,
      label: RANGE_LABELS[rangeKey],
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
      granularity: g,
    },
    kpis,
    revenueSeries,
    revenueBySource,
    bookingsByBeach,
    tariffMix,
    paymentMix,
    heatmap: { hours, days: WEEKDAYS, cells, max: heatMax },
    playersGrowth,
    levels,
    topPlayers,
    coaches,
    topProducts,
    lowStock,
    events: eventRows,
    activity,
    alerts: {
      unreadMessages: messages.filter((m) => !m.read).length,
      pendingOrders: orders.filter((o) => o.status === "en_attente").length,
      lowStock: lowStock.length,
      upcomingEvents: eventRows.filter((e) => e.upcoming).length,
    },
  };
}

export function parseRange(v: string | null): RangeKey {
  return v === "7d" || v === "30d" || v === "90d" || v === "12m" || v === "all" ? v : "30d";
}
