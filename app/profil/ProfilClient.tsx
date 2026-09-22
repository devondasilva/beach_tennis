"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatFCFA } from "@/lib/pricing";

interface Player {
  id: string;
  name: string;
  phone: string;
  level: string;
  loyaltyPoints: number;
}
interface Booking {
  id: string;
  tariffLabel: string;
  date: string;
  time: string;
  price: number;
}
interface Lesson {
  id: string;
  formulaLabel: string;
  coach: string;
  date: string;
  time: string;
  price: number;
}
interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}
interface EventReg {
  id: string;
  title: string;
  date: string;
}

interface ProfileData {
  player: Player;
  bookings: Booking[];
  lessons: Lesson[];
  orders: Order[];
  events: EventReg[];
}

const LEVEL_LABEL: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

export default function ProfilClient() {
  const params = useSearchParams();
  const initialId = params.get("playerId") ?? "";

  const [phone, setPhone] = useState("");
  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadById(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/players/${id}`);
      const d = await res.json();
      if (!res.ok) {
        setError(d.error ?? "Profil introuvable.");
        return;
      }
      setData(d);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialId) loadById(initialId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/players");
      const d = await res.json();
      const match = (d.players as Player[]).find((p) => p.phone === phone.trim());
      if (!match) {
        setError("Aucun profil ne correspond à ce numéro. Réservez une première séance pour en créer un.");
        setData(null);
        return;
      }
      await loadById(match.id);
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <div className="max-w-content mx-auto px-6 py-16">
        <div className="max-w-md">
          <p className="tag-label mb-3">Mon profil</p>
          <h1 className="font-display text-4xl text-ink">Retrouvez votre espace</h1>
          <p className="mt-3 text-ink/70">
            Entrez le numéro de téléphone utilisé lors d&rsquo;une réservation pour
            afficher votre QR code, vos points et votre historique.
          </p>
          <form onSubmit={handleLookup} className="mt-8 space-y-3">
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+229 97 00 00 00"
              className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
            />
            {error && (
              <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-card bg-coral text-white font-semibold px-6 py-3 hover:bg-ink transition-colors disabled:opacity-60"
            >
              {loading ? "Recherche…" : "Afficher mon profil"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { player, bookings, lessons, orders, events } = data;

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="rounded-card bg-ink text-sandlight p-6 text-center">
            <p className="tag-label !text-sun">Carte membre</p>
            <h1 className="font-display text-2xl mt-2">{player.name}</h1>
            <p className="text-sandlight/70 text-sm">{player.phone}</p>
            <p className="mt-1 text-sm text-sun">{LEVEL_LABEL[player.level] ?? player.level}</p>

            <div className="mt-4 bg-white rounded-card p-3 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qrcode/${player.id}`}
                alt={`QR code d'enregistrement de ${player.name}`}
                width={160}
                height={160}
              />
            </div>

            <div className="rule bg-sandlight/20 my-4" />
            <p className="text-sm text-sandlight/75">Points de fidélité</p>
            <p className="font-display text-3xl text-sun">{player.loyaltyPoints}</p>
            <p className="text-xs text-sandlight/60 mt-1">
              200 points = une séance offerte
            </p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-10">
          <section>
            <h2 className="font-display text-xl text-ink mb-4">Réservations</h2>
            {bookings.length === 0 ? (
              <p className="text-sm text-ink/60">Aucune réservation pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-card border border-ink/10 px-4 py-3 text-sm"
                  >
                    <span>
                      {b.tariffLabel} — {b.date} à {b.time}
                    </span>
                    <span className="font-semibold text-ink">{formatFCFA(b.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-4">Cours avec un coach</h2>
            {lessons.length === 0 ? (
              <p className="text-sm text-ink/60">Aucun cours réservé pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {lessons.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between rounded-card border border-ink/10 px-4 py-3 text-sm"
                  >
                    <span>
                      {l.formulaLabel} avec {l.coach} — {l.date} à {l.time}
                    </span>
                    <span className="font-semibold text-ink">{formatFCFA(l.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-4">Événements</h2>
            {events.length === 0 ? (
              <p className="text-sm text-ink/60">Aucune inscription à un tournoi pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {events.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-card border border-ink/10 px-4 py-3 text-sm"
                  >
                    {e.title} — {e.date}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-4">Commandes boutique</h2>
            {orders.length === 0 ? (
              <p className="text-sm text-ink/60">Aucune commande pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between rounded-card border border-ink/10 px-4 py-3 text-sm"
                  >
                    <span>{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</span>
                    <span className="font-semibold text-ink">{formatFCFA(o.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
