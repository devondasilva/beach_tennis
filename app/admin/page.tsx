"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Users,
  CalendarDays,
  GraduationCap,
  Trophy,
  ShoppingBag,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { formatFCFA } from "@/lib/pricing";
import { Stats } from "./types";
import BookingsTab from "./BookingsTab";
import LessonsTab from "./LessonsTab";
import EventsTab from "./EventsTab";
import ShopTab from "./ShopTab";
import OrdersTab from "./OrdersTab";
import PlayersTab from "./PlayersTab";
import BeachesTab from "./BeachesTab";
import AdsTab from "./AdsTab";
import PartnersTab from "./PartnersTab";
import ArticlesTab from "./ArticlesTab";
import AccountTab from "./AccountTab";
import ContactTab from "./ContactTab";

type Tab =
  | "apercu"
  | "reservations"
  | "cours"
  | "evenements"
  | "boutique"
  | "commandes"
  | "joueurs"
  | "plages"
  | "publicites"
  | "partenaires"
  | "actualites"
  | "messages"
  | "compte";

const TABS: { id: Tab; label: string }[] = [
  { id: "apercu", label: "Vue d'ensemble" },
  { id: "reservations", label: "Réservations" },
  { id: "cours", label: "Cours" },
  { id: "evenements", label: "Événements" },
  { id: "plages", label: "Plages" },
  { id: "boutique", label: "Boutique" },
  { id: "commandes", label: "Commandes" },
  { id: "joueurs", label: "Joueurs" },
  { id: "publicites", label: "Publicités" },
  { id: "partenaires", label: "Partenaires" },
  { id: "actualites", label: "Actualités" },
  { id: "messages", label: "Messages" },
  { id: "compte", label: "Mon compte" },
];

// Palette de badges pour les cartes KPI — chaque teinte reprend l'identité
// de la marque (corail / lagon / soleil / palmier) plutôt qu'un jeu de
// couleurs arbitraire, pour rester cohérent avec le reste du site.
const BADGE_STYLES = {
  coral: "bg-coral/10 text-coral",
  lagoon: "bg-lagoon/10 text-lagoondark",
  sun: "bg-sun/20 text-[#854F0B]",
  palm: "bg-palm/10 text-palm",
} as const;

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: keyof typeof BADGE_STYLES;
}) {
  return (
    <div className="rounded-2xl bg-white border border-ink/10 p-5 text-center sm:text-left">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-3 ${BADGE_STYLES[tone]}`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <p className="font-display text-xl text-ink">{value}</p>
      <p className="text-xs text-ink/60 mt-1">{label}</p>
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
      <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16 text-center">
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
    return <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">Chargement du tableau de bord…</div>;
  }

  const t = stats.totals;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-10 sm:pb-16">
      {/* Bandeau sombre : titre + onglets, façon "sportif dynamique" */}
      <div className="rounded-2xl bg-ink px-5 sm:px-7 py-6 sm:py-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-sun mb-2">
              Back-office
            </p>
            <h1 className="font-display text-2xl sm:text-3xl text-sandlight">Tableau de bord</h1>
            {adminName && (
              <p className="mt-1 text-xs text-sandlight/60">Connecté en tant que {adminName}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-sandlight/25 text-sandlight/80 hover:border-coral hover:text-coral transition-colors"
          >
            Déconnexion
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${
                tab === tb.id
                  ? "bg-coral text-white"
                  : "bg-sandlight/10 text-sandlight/70 hover:bg-sandlight/20"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {tab === "apercu" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Chiffre d'affaires total"
                value={formatFCFA(t.totalRevenue)}
                icon={Wallet}
                tone="coral"
              />
              <KpiCard
                label="Joueurs enregistrés"
                value={String(t.players)}
                icon={Users}
                tone="sun"
              />
              <KpiCard
                label="Réservations de terrain"
                value={String(t.bookings)}
                icon={CalendarDays}
                tone="lagoon"
              />
              <KpiCard
                label="Cours réservés"
                value={String(t.lessons)}
                icon={GraduationCap}
                tone="palm"
              />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Revenu séances"
                value={formatFCFA(t.revenueBookings)}
                icon={Trophy}
                tone="lagoon"
              />
              <KpiCard
                label="Revenu cours"
                value={formatFCFA(t.revenueLessons)}
                icon={GraduationCap}
                tone="palm"
              />
              <KpiCard
                label="Revenu boutique"
                value={formatFCFA(t.revenueOrders)}
                icon={ShoppingBag}
                tone="coral"
              />
              <KpiCard
                label="Revenu événements"
                value={formatFCFA(t.revenueEvents)}
                icon={PartyPopper}
                tone="sun"
              />
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
        {tab === "publicites" && <AdsTab />}
        {tab === "partenaires" && <PartnersTab />}
        {tab === "actualites" && <ArticlesTab />}
        {tab === "messages" && <ContactTab />}
        {tab === "compte" && <AccountTab adminName={adminName ?? undefined} />}
      </div>
    </div>
  );
}
