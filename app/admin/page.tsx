"use client";

import { useEffect, useState } from "react";
import { formatFCFA } from "@/lib/pricing";

interface Stats {
  totals: {
    players: number;
    bookings: number;
    lessons: number;
    orders: number;
    eventRegistrations: number;
    revenueBookings: number;
    revenueLessons: number;
    revenueOrders: number;
    revenueEvents: number;
    totalRevenue: number;
  };
  bookings: { id: string; playerName: string; tariffLabel: string; date: string; time: string; price: number }[];
  lessons: { id: string; playerName: string; formulaLabel: string; coach: string; date: string; time: string; price: number }[];
  orders: { id: string; playerName: string; items: { name: string; qty: number }[]; total: number }[];
  events: { id: string; title: string; date: string; entryFee: number; capacity: number; registrations: { playerName: string }[] }[];
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-ink/15 p-5">
      <p className="text-xs text-ink/60">{label}</p>
      <p className="font-display text-2xl text-ink mt-1">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <div className="max-w-content mx-auto px-6 py-16">Chargement du tableau de bord…</div>;
  }

  const t = stats.totals;

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <p className="tag-label mb-3">Back-office</p>
      <h1 className="font-display text-4xl text-ink">Tableau de bord</h1>
      <p className="mt-3 text-ink/70 max-w-xl">
        Vue d&rsquo;ensemble de l&rsquo;activité : réservations, cours, boutique et
        événements, tous canaux confondus.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Chiffre d'affaires total" value={formatFCFA(t.totalRevenue)} />
        <KpiCard label="Joueurs enregistrés" value={String(t.players)} />
        <KpiCard label="Réservations de terrain" value={String(t.bookings)} />
        <KpiCard label="Cours réservés" value={String(t.lessons)} />
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Revenu séances" value={formatFCFA(t.revenueBookings)} />
        <KpiCard label="Revenu cours" value={formatFCFA(t.revenueLessons)} />
        <KpiCard label="Revenu boutique" value={formatFCFA(t.revenueOrders)} />
        <KpiCard label="Revenu événements" value={formatFCFA(t.revenueEvents)} />
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-10">
        <section>
          <h2 className="font-display text-xl text-ink mb-4">Dernières réservations</h2>
          <div className="rounded-card border border-ink/15 divide-y divide-ink/10">
            {stats.bookings.length === 0 && (
              <p className="p-4 text-sm text-ink/60">Aucune réservation.</p>
            )}
            {stats.bookings.slice(0, 8).map((b) => (
              <div key={b.id} className="p-4 text-sm flex justify-between">
                <span>
                  {b.playerName} — {b.tariffLabel} — {b.date} {b.time}
                </span>
                <span className="font-semibold">{formatFCFA(b.price)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-4">Derniers cours</h2>
          <div className="rounded-card border border-ink/15 divide-y divide-ink/10">
            {stats.lessons.length === 0 && (
              <p className="p-4 text-sm text-ink/60">Aucun cours réservé.</p>
            )}
            {stats.lessons.slice(0, 8).map((l) => (
              <div key={l.id} className="p-4 text-sm flex justify-between">
                <span>
                  {l.playerName} — {l.formulaLabel} avec {l.coach} — {l.date} {l.time}
                </span>
                <span className="font-semibold">{formatFCFA(l.price)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-4">Commandes boutique</h2>
          <div className="rounded-card border border-ink/15 divide-y divide-ink/10">
            {stats.orders.length === 0 && (
              <p className="p-4 text-sm text-ink/60">Aucune commande.</p>
            )}
            {stats.orders.slice(0, 8).map((o) => (
              <div key={o.id} className="p-4 text-sm flex justify-between">
                <span>
                  {o.playerName} — {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </span>
                <span className="font-semibold">{formatFCFA(o.total)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-4">Événements</h2>
          <div className="rounded-card border border-ink/15 divide-y divide-ink/10">
            {stats.events.map((e) => (
              <div key={e.id} className="p-4 text-sm flex justify-between">
                <span>
                  {e.title} — {e.date}
                </span>
                <span className="font-semibold">
                  {e.registrations.length} / {e.capacity} inscrits
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
