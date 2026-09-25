"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatFCFA } from "@/lib/pricing";
import { Stats } from "./types";
import BookingsTab from "./BookingsTab";
import LessonsTab from "./LessonsTab";
import EventsTab from "./EventsTab";
import ShopTab from "./ShopTab";
import OrdersTab from "./OrdersTab";
import PlayersTab from "./PlayersTab";
import BeachesTab from "./BeachesTab";

type Tab = "apercu" | "reservations" | "cours" | "evenements" | "boutique" | "commandes" | "joueurs" | "plages";

const TABS: { id: Tab; label: string }[] = [
  { id: "apercu", label: "Vue d'ensemble" },
  { id: "reservations", label: "Réservations" },
  { id: "cours", label: "Cours" },
  { id: "evenements", label: "Événements" },
  { id: "plages", label: "Plages" },
  { id: "boutique", label: "Boutique" },
  { id: "commandes", label: "Commandes" },
  { id: "joueurs", label: "Joueurs" },
];

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-ink/15 p-5">
      <p className="text-xs text-ink/60">{label}</p>
      <p className="font-display text-2xl text-ink mt-1">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<Tab>("apercu");
  const [unauthorized, setUnauthorized] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/stats").then((r) => {
      if (r.status === 401) {
        setUnauthorized(true);
        return;
      }
      r.json().then(setStats);
    });
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.session?.role === "admin") setAdminName(d.session.name);
      });
    refresh();
  }, [refresh]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (unauthorized) {
    return (
      <div className="max-w-content mx-auto px-6 py-16 text-center">
        <p className="text-ink/70">
          Votre session a expiré.{" "}
          <a href="/login?next=/admin" className="text-coral font-semibold hover:underline">
            Reconnectez-vous
          </a>
          .
        </p>
      </div>
    );
  }

  if (!stats) {
    return <div className="max-w-content mx-auto px-6 py-16">Chargement du tableau de bord…</div>;
  }

  const t = stats.totals;

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="tag-label mb-3">Back-office</p>
          <h1 className="font-display text-4xl text-ink">Tableau de bord</h1>
          {adminName && (
            <p className="mt-2 text-sm text-ink/60">Connecté en tant que {adminName}</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
              tab === tb.id
                ? "bg-ink text-white border-ink"
                : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "apercu" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Chiffre d'affaires total" value={formatFCFA(t.totalRevenue)} />
              <KpiCard label="Joueurs enregistrés" value={String(t.players)} />
              <KpiCard label="Réservations de terrain" value={String(t.bookings)} />
              <KpiCard label="Cours réservés" value={String(t.lessons)} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Revenu séances" value={formatFCFA(t.revenueBookings)} />
              <KpiCard label="Revenu cours" value={formatFCFA(t.revenueLessons)} />
              <KpiCard label="Revenu boutique" value={formatFCFA(t.revenueOrders)} />
              <KpiCard label="Revenu événements" value={formatFCFA(t.revenueEvents)} />
            </div>
          </div>
        )}

        {tab === "reservations" && (
          <BookingsTab bookings={stats.bookings} onChanged={refresh} />
        )}
        {tab === "cours" && <LessonsTab lessons={stats.lessons} onChanged={refresh} />}
        {tab === "evenements" && <EventsTab events={stats.events} onChanged={refresh} />}
        {tab === "plages" && <BeachesTab />}
        {tab === "boutique" && <ShopTab products={stats.products} onChanged={refresh} />}
        {tab === "commandes" && <OrdersTab orders={stats.orders} onChanged={refresh} />}
        {tab === "joueurs" && <PlayersTab players={stats.players} onChanged={refresh} />}
      </div>
    </div>
  );
}
