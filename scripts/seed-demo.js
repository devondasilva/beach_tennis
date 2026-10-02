#!/usr/bin/env node
/**
 * Génère un jeu de données de DÉMONSTRATION réaliste (12 mois d'activité)
 * pour visualiser le tableau de bord et ses statistiques.
 *
 *   npm run seed:demo            → sauvegarde /data puis génère les données
 *   npm run seed:restore         → restaure la dernière sauvegarde
 *
 * Les comptes admin, les plages, les produits, les partenaires et les
 * images sont conservés. Une copie complète de /data est faite avant
 * toute écriture, dans /data/_backups/<horodatage>/.
 */
const fs = require("fs");
const path = require("path");

const DATA = path.join(process.cwd(), "data");
const BACKUPS = path.join(DATA, "_backups");
const read = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf-8"));
const write = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2), "utf-8");

/* ---------- Restauration ---------- */
if (process.argv.includes("--restore")) {
  if (!fs.existsSync(BACKUPS)) {
    console.error("Aucune sauvegarde trouvée.");
    process.exit(1);
  }
  const last = fs.readdirSync(BACKUPS).sort().pop();
  for (const f of fs.readdirSync(path.join(BACKUPS, last))) {
    fs.copyFileSync(path.join(BACKUPS, last, f), path.join(DATA, f));
  }
  console.log(`✔ Données restaurées depuis data/_backups/${last}`);
  process.exit(0);
}

/* ---------- Sauvegarde ---------- */
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(path.join(BACKUPS, stamp), { recursive: true });
for (const f of fs.readdirSync(DATA)) {
  if (f.endsWith(".json")) fs.copyFileSync(path.join(DATA, f), path.join(BACKUPS, stamp, f));
}

/* ---------- Aléatoire reproductible ---------- */
let seed = 20260101;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const weighted = (pairs) => {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [v, w] of pairs) if ((r -= w) <= 0) return v;
  return pairs[pairs.length - 1][0];
};
const id = (p) => `${p}-${Date.now().toString(36)}-${Math.floor(rand() * 1e8).toString(36)}`;
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const NOW = new Date();
const DAY = 86400000;
const START = new Date(NOW.getTime() - 365 * DAY);

/* ---------- Référentiels ---------- */
const FIRST = ["Koffi", "Afi", "Sèna", "Rodrigue", "Fifamè", "Gildas", "Mariam", "Ulrich", "Aïcha", "Romaric", "Prisca", "Bonaventure", "Nadège", "Hermann", "Carine", "Ismaël", "Larissa", "Merveille", "Steve", "Judith", "Arnaud", "Grâce", "Habib", "Inès", "Jérôme", "Kafui", "Lionel", "Mireille", "Noël", "Olga", "Pascal", "Rachida", "Serge", "Tatiana", "Yannick", "Zoé", "Dossou", "Hounsou", "Bénédicte", "Eric"];
const LAST = ["Agbodjan", "Houngbédji", "Dossou", "Gandonou", "Saizonou", "Danhouan", "Akpovi", "Ahouansou", "Kpadonou", "Tossou", "Zinsou", "Adjovi", "Hounkpatin", "Sossa", "Amoussou", "Codjo", "Fagla", "Gbaguidi", "Hessou", "Lokossou"];
const TARIFFS = [
  ["decouverte", "Séance découverte (1 personne · 30 min)", 1000, 30],
  ["standard", "Séance standard (1 personne · 1h)", 1800, 26],
  ["duo", "Forfait duo (2 personnes · 1h)", 3000, 22],
  ["famille", "Forfait famille (3 à 4 personnes · 1h)", 5200, 13],
  ["groupe", "Forfait groupe (5 à 6 personnes · 1h)", 7200, 9],
];
const LESSONS = [
  ["individuel", "Cours particulier (1 personne · 1h)", 6000, 60],
  ["groupe", "Cours en petit groupe (2 à 4 personnes · 1h · par personne)", 4000, 40],
];
const PLAY_SLOTS = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
const LESSON_SLOTS = ["09:00", "10:00", "16:00", "17:00", "18:00"];
const PAY = [["mtn_momo", 58], ["moov_money", 27], ["sur_place", 15]];

const beaches = read("beaches.json");
const coaches = read("coaches.json");
const products = read("products.json");
const events = read("events.json");
const existingPlayers = read("players.json");

// Croissance progressive : plus d'activité en fin de période (projet qui décolle).
const growth = (t) => 0.35 + 0.65 * ((t - START.getTime()) / (NOW.getTime() - START.getTime()));

/* ---------- Joueurs ---------- */
const players = [...existingPlayers];
for (let i = 0; i < 160; i++) {
  // Tirage biaisé vers les mois récents
  const t = START.getTime() + Math.sqrt(rand()) * (NOW.getTime() - START.getTime());
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  players.push({
    id: id("pl"),
    name,
    phone: `+229 01 ${pad(Math.floor(rand() * 90 + 10))} ${pad(Math.floor(rand() * 90 + 10))} ${pad(Math.floor(rand() * 90 + 10))} ${pad(Math.floor(rand() * 90 + 10))}`,
    level: weighted([["debutant", 52], ["intermediaire", 32], ["confirme", 16]]),
    loyaltyPoints: 0,
    createdAt: new Date(t).toISOString(),
  });
}
const playerAt = (t) => {
  const eligible = players.filter((p) => new Date(p.createdAt).getTime() <= t);
  // Les habitués reviennent plus souvent : on favorise les premiers inscrits.
  return eligible.length ? eligible[Math.floor(Math.pow(rand(), 1.6) * eligible.length)] : players[0];
};

/* ---------- Réservations de terrain ---------- */
const bookings = read("bookings.json");
for (let t = START.getTime(); t <= NOW.getTime() + 14 * DAY; t += DAY) {
  const d = new Date(t);
  const dow = d.getDay(); // 5 ven, 6 sam, 0 dim
  const base = dow === 6 ? 7 : dow === 0 ? 6 : dow === 5 ? 4 : 0.4;
  const n = Math.round(base * growth(Math.min(t, NOW.getTime())) * (0.6 + rand() * 0.8));
  for (let k = 0; k < n; k++) {
    const slot = dow === 5 ? pick(PLAY_SLOTS.slice(2)) : weighted(PLAY_SLOTS.map((s, i) => [s, [3, 4, 6, 7, 6, 4][i]]));
    const playAt = new Date(`${ymd(d)}T${slot}:00`).getTime();
    const p = playerAt(playAt);
    const [tariffId, tariffLabel, price] = weighted(TARIFFS.map((x) => [x, x[3]]));
    const beach = weighted(beaches.map((b, i) => [b, i === 0 ? 65 : 35]));
    const future = playAt > NOW.getTime();
    bookings.push({
      playerId: p.id,
      playerName: p.name,
      beachId: beach.id,
      beachName: beach.name,
      tariffId,
      tariffLabel,
      date: ymd(d),
      time: slot,
      price,
      paymentMethod: weighted(PAY),
      status: rand() < 0.06 ? "annulee" : !future && rand() < 0.25 ? "enregistree_sur_place" : "confirmee",
      id: id("bk"),
      createdAt: new Date(playAt - (1 + rand() * 5) * DAY).toISOString(),
    });
  }
}

/* ---------- Cours ---------- */
const lessons = read("lessons.json");
for (let t = START.getTime(); t <= NOW.getTime() + 10 * DAY; t += DAY) {
  const d = new Date(t);
  const n = Math.round(0.6 * growth(Math.min(t, NOW.getTime())) * (rand() * 1.8));
  for (let k = 0; k < n; k++) {
    const slot = pick(LESSON_SLOTS);
    const at = new Date(`${ymd(d)}T${slot}:00`).getTime();
    const p = playerAt(at);
    const [formulaId, formulaLabel, price] = weighted(LESSONS.map((x) => [x, x[3]]));
    lessons.push({
      playerId: p.id,
      playerName: p.name,
      coach: pick(coaches).name,
      formulaId,
      formulaLabel,
      date: ymd(d),
      time: slot,
      price,
      paymentMethod: weighted(PAY),
      status: rand() < 0.05 ? "annulee" : "confirme",
      id: id("ls"),
      createdAt: new Date(at - (1 + rand() * 4) * DAY).toISOString(),
    });
  }
}

/* ---------- Commandes boutique ---------- */
const orders = read("orders.json");
for (let i = 0; i < 110; i++) {
  const t = START.getTime() + Math.sqrt(rand()) * (NOW.getTime() - START.getTime());
  const p = playerAt(t);
  const nItems = 1 + Math.floor(rand() * 2);
  const items = [];
  for (let k = 0; k < nItems; k++) {
    const pr = weighted(products.map((x) => [x, x.price < 7000 ? 3 : 1]));
    if (items.some((it) => it.productId === pr.id)) continue;
    items.push({ productId: pr.id, name: pr.name, qty: 1 + (rand() < 0.2 ? 1 : 0), price: pr.price });
  }
  const recent = NOW.getTime() - t < 10 * DAY;
  orders.push({
    playerId: p.id,
    playerName: p.name,
    items,
    total: items.reduce((s, it) => s + it.qty * it.price, 0),
    status: recent && rand() < 0.6 ? "en_attente" : rand() < 0.07 ? "annulee" : "livree",
    id: id("or"),
    createdAt: new Date(t).toISOString(),
  });
}
// Quelques produits à faible stock pour illustrer les alertes
products.forEach((p, i) => {
  if (i === 1) p.stock = 3;
  if (i === 3) p.stock = 2;
});

/* ---------- Événements ---------- */
const pastEvents = [
  ["Tournoi de rentrée", 330, 3000, 24],
  ["Open de Noël", 280, 5000, 32],
  ["Coupe de la Saint-Valentin (duos)", 230, 4000, 24],
  ["Tournoi Fête du Travail", 155, 3000, 32],
  ["Open d'été Fidjrossè", 70, 5000, 40],
];
for (const [title, daysAgo, fee, cap] of pastEvents) {
  events.push({
    id: id("evt"),
    title,
    date: ymd(new Date(NOW.getTime() - daysAgo * DAY)),
    category: pick(["Débutants & familles", "Confirmés", "Tous niveaux"]),
    description: "Tournoi mensuel en doublette sur le sable.",
    entryFee: fee,
    prize: "Dotation équipementier + bons boutique",
    capacity: cap,
    registrations: [],
  });
}
for (const e of events) {
  const eventAt = new Date(`${e.date}T09:00:00`).getTime();
  const upcoming = eventAt > NOW.getTime();
  const target = Math.min(e.capacity, Math.round(e.capacity * (upcoming ? 0.35 + rand() * 0.4 : 0.7 + rand() * 0.3)));
  const used = new Set(e.registrations.map((r) => r.playerId));
  for (let k = 0; k < target * 2 && e.registrations.length < target; k++) {
    let regAt = eventAt - rand() * 25 * DAY;
    if (regAt > NOW.getTime()) regAt = NOW.getTime() - rand() * 12 * DAY;
    const p = playerAt(regAt);
    if (used.has(p.id)) continue;
    used.add(p.id);
    e.registrations.push({ playerId: p.id, playerName: p.name, registeredAt: new Date(regAt).toISOString() });
  }
}

/* ---------- Avis ---------- */
const reviews = read("reviews.json");
const COMMENTS = ["Terrain impeccable et coach au top !", "Super ambiance le samedi soir.", "Très bon accueil, on reviendra en famille.", "Réservation rapide, paiement MoMo sans souci.", "Un peu d'attente au créneau de 17h mais très bien.", "Le meilleur spot de Cotonou pour le beach tennis."];
for (let i = 0; i < 46; i++) {
  const t = START.getTime() + rand() * (NOW.getTime() - START.getTime());
  const p = playerAt(t);
  reviews.push({
    id: id("rv"),
    beachId: weighted(beaches.map((b, j) => [b, j === 0 ? 60 : 40])).id,
    playerId: p.id,
    playerName: p.name,
    rating: weighted([[5, 52], [4, 33], [3, 11], [2, 4]]),
    comment: pick(COMMENTS),
    createdAt: new Date(t).toISOString(),
  });
}

/* ---------- Messages de contact ---------- */
const messages = read("contact-messages.json");
const MSG = [
  ["Restaurant Le Lagon", "Bonjour, nous avons une plage privée à Ouidah et serions intéressés par un terrain."],
  ["Association Sport Pour Tous", "Possible d'organiser une journée découverte pour 30 jeunes ?"],
  ["Hôtel Azalaï", "Partenariat pour nos clients le week-end ?"],
  ["Club Entreprise SBEE", "Nous souhaitons réserver pour un team building de 18 personnes."],
  ["Mairie de Grand-Popo", "Projet d'animation estivale, merci de nous recontacter."],
];
MSG.forEach(([name, message], i) => {
  messages.push({
    id: id("msg"),
    name,
    phone: `+229 01 9${i} 00 00 0${i}`,
    message,
    read: i > 2,
    createdAt: new Date(NOW.getTime() - (i * 3 + 1) * DAY).toISOString(),
  });
});

/* ---------- Points de fidélité (1 pt / 100 FCFA) ---------- */
const spent = new Map();
const add = (pid, amt) => spent.set(pid, (spent.get(pid) || 0) + amt);
bookings.filter((b) => b.status !== "annulee").forEach((b) => add(b.playerId, b.price));
lessons.filter((l) => l.status !== "annulee").forEach((l) => add(l.playerId, l.price));
orders.filter((o) => o.status !== "annulee").forEach((o) => add(o.playerId, o.total));
events.forEach((e) => e.registrations.forEach((r) => add(r.playerId, e.entryFee)));
players.forEach((p) => (p.loyaltyPoints = Math.floor((spent.get(p.id) || 0) / 100)));

write("players.json", players);
write("bookings.json", bookings);
write("lessons.json", lessons);
write("orders.json", orders);
write("products.json", products);
write("events.json", events);
write("reviews.json", reviews);
write("contact-messages.json", messages);

console.log("✔ Données de démonstration générées");
console.log(`  ${players.length} joueurs · ${bookings.length} réservations · ${lessons.length} cours · ${orders.length} commandes · ${events.length} événements · ${reviews.length} avis`);
console.log(`  Sauvegarde de vos données d'origine : data/_backups/${stamp}`);
console.log("  Pour revenir en arrière : npm run seed:restore");
