"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  beachName: string;
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
  const router = useRouter();
  const params = useSearchParams();
  const explicitId = params.get("playerId") ?? "";

  const [isOwnSession, setIsOwnSession] = useState(false);
  const [resolvedId, setResolvedId] = useState<string | null>(explicitId || null);
  const [resolving, setResolving] = useState(!explicitId);

  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si aucun lien personnel n'est fourni dans l'URL, on regarde s'il existe
  // une session joueur active (connecté via /login) pour charger son propre profil.
  useEffect(() => {
    if (explicitId) return;
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.session?.role === "player") {
          setIsOwnSession(true);
          setResolvedId(d.session.id);
        }
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [explicitId]);

  useEffect(() => {
    if (!resolvedId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/players/${resolvedId}`)
      .then(async (res) => {
        const d = await res.json();
        if (!res.ok) {
          setError(d.error ?? "Profil introuvable.");
          return;
        }
        setData(d);
      })
      .finally(() => setLoading(false));
  }, [resolvedId]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (resolving) {
    return (
      <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16 text-ink/60">
        Chargement…
      </div>
    );
  }

  if (!resolvedId) {
    return (
      <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">
        <div className="max-w-md">
          <p className="tag-label mb-3">Mon profil</p>
          <h1 className="font-display text-4xl text-ink">Retrouvez votre espace</h1>
          <p className="mt-3 text-ink/70">
            Connectez-vous depuis la page de connexion, ou utilisez le lien personnel
            (QR code, points de fidélité, historique) reçu après une réservation, un
            cours, une commande ou une inscription à un événement.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-card bg-ink text-white font-semibold px-6 py-3 hover:bg-coral transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16 text-ink/60">
        {error ? (
          <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3 inline-block">
            {error}
          </p>
        ) : (
          "Chargement…"
        )}
      </div>
    );
  }

  const { player, bookings, lessons, orders, events } = data;

  return (
    <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">
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

            {isOwnSession && (
              <button
                onClick={handleLogout}
                className="mt-5 text-xs font-bold uppercase tracking-widest text-sandlight/70 hover:text-coral transition-colors"
              >
                Se déconnecter
              </button>
            )}
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
                      {b.tariffLabel} — {b.beachName} — {b.date} à {b.time}
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
