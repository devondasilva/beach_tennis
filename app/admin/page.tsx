"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Download,
  ExternalLink,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  Package,
  PartyPopper,
  RefreshCw,
  ShoppingBag,
  UserCog,
  Users,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import type { RangeKey } from "@/lib/analytics";
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
import OverviewView from "./dashboard/OverviewView";
import AnalyticsView from "./dashboard/AnalyticsView";
import { SegmentedControl, SkeletonDashboard, EASE } from "./dashboard/ui";

type Tab =
  | "apercu"
  | "statistiques"
  | "reservations"
  | "cours"
  | "evenements"
  | "plages"
  | "boutique"
  | "commandes"
  | "joueurs"
  | "messages"
  | "actualites"
  | "publicites"
  | "partenaires"
  | "compte";

interface NavItem {
  id: Tab;
  label: string;
  icon: LucideIcon;
  badge?: (s: Stats) => number;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Pilotage",
    items: [
      { id: "apercu", label: "Vue d'ensemble", icon: LayoutDashboard },
      { id: "statistiques", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    group: "Activité",
    items: [
      { id: "reservations", label: "Réservations", icon: CalendarDays },
      { id: "cours", label: "Cours", icon: GraduationCap },
      { id: "evenements", label: "Événements", icon: PartyPopper, badge: (s) => s.analytics.alerts.upcomingEvents },
      { id: "plages", label: "Plages", icon: Waves },
    ],
  },
  {
    group: "Commerce",
    items: [
      { id: "boutique", label: "Boutique", icon: ShoppingBag, badge: (s) => s.analytics.alerts.lowStock },
      { id: "commandes", label: "Commandes", icon: Package, badge: (s) => s.analytics.alerts.pendingOrders },
    ],
  },
  {
    group: "Communauté",
    items: [
      { id: "joueurs", label: "Joueurs", icon: Users },
      { id: "messages", label: "Messages", icon: Mail, badge: (s) => s.analytics.alerts.unreadMessages },
    ],
  },
  {
    group: "Contenu",
    items: [
      { id: "actualites", label: "Actualités", icon: Newspaper },
      { id: "publicites", label: "Publicités", icon: Megaphone },
      { id: "partenaires", label: "Partenaires", icon: Handshake },
    ],
  },
];

const ALL_ITEMS: NavItem[] = [...NAV.flatMap((g) => g.items), { id: "compte", label: "Mon compte", icon: UserCog }];

const RANGES: { value: RangeKey; label: string }[] = [
  { value: "7d", label: "7 j" },
  { value: "30d", label: "30 j" },
  { value: "90d", label: "90 j" },
  { value: "12m", label: "12 mois" },
  { value: "all", label: "Tout" },
];

const SUBTITLES: Partial<Record<Tab, string>> = {
  apercu: "Les indicateurs clés de l'activité, en un coup d'œil.",
  statistiques: "Analyses détaillées : affluence, plages, joueurs, coachs et boutique.",
};

/* ------------------------------------------------------------------ */
/*  Export CSV de la série de recettes                                 */
/* ------------------------------------------------------------------ */
function exportCsv(stats: Stats) {
  const a = stats.analytics;
  const head = ["Période", "Terrains", "Cours", "Boutique", "Événements", "Total"];
  const lines = a.revenueSeries.map((r) => [r.label, r.terrains, r.cours, r.boutique, r.evenements, r.total].join(";"));
  const csv = "﻿" + [head.join(";"), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `recettes-${a.range.key}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Barre latérale                                                      */
/* ------------------------------------------------------------------ */
function Sidebar({
  tab,
  setTab,
  stats,
  adminName,
  onLogout,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  stats: Stats | null;
  adminName: string | null;
  onLogout: () => void;
}) {
  return (
    <div className="h-full flex flex-col bg-ink text-white">
      <Link href="/" className="flex items-center gap-3 px-5 h-[4.5rem] border-b border-white/[0.08] shrink-0">
        <Image src="/logo.png" alt="" width={36} height={36} />
        <div className="leading-none">
          <p className="font-display font-black text-[1.05rem] leading-tight whitespace-nowrap">
            Beach Tennis <span className="text-coral">Bénin</span>
          </p>
          <p className="label-mono !text-[0.55rem] text-white/40 mt-1">Back-office</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto scroll-thin-dark px-3 py-5 space-y-6" aria-label="Navigation du back-office">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="px-3 mb-2 label-mono !text-[0.58rem] text-white/35">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = tab === it.id;
                const badge = stats && it.badge ? it.badge(stats) : 0;
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => setTab(it.id)}
                      aria-current={active ? "page" : undefined}
                      className={`group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                        active ? "text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.06]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {active && (
                        <motion.span
                          layoutId="sidebar-bar"
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-coral"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <it.icon size={17} className={`relative ${active ? "text-coral" : ""}`} />
                      <span className="relative flex-1 text-left">{it.label}</span>
                      {badge > 0 && (
                        <span className="relative min-w-[1.25rem] h-5 px-1.5 rounded-full bg-coral text-[10px] font-bold flex items-center justify-center tabular">
                          {badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/[0.08] shrink-0">
        <button
          onClick={() => setTab("compte")}
          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
            tab === "compte" ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
          }`}
        >
          <span className="w-9 h-9 rounded-full bg-coral flex items-center justify-center font-bold text-sm">
            {(adminName ?? "A").charAt(0).toUpperCase()}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold truncate">{adminName ?? "Administrateur"}</span>
            <span className="block text-[11px] text-white/45">Mon compte</span>
          </span>
        </button>
        <button
          onClick={onLogout}
          className="mt-1 w-full flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-white/50 hover:text-coral transition-colors"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTabState] = useState<Tab>("apercu");
  const [range, setRange] = useState<RangeKey>("30d");
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const reqId = useRef(0);

  const refresh = useCallback(() => {
    const id = ++reqId.current;
    setLoading(true);
    fetch(`/api/stats?range=${range}`)
      .then(async (r) => {
        if (r.status === 401) {
          setUnauthorized(true);
          return;
        }
        const data = (await r.json()) as Stats;
        if (id === reqId.current) {
          setStats(data);
          setUpdatedAt(new Date());
        }
      })
      .finally(() => id === reqId.current && setLoading(false));
  }, [range]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.session?.role === "admin") setAdminName(d.session.name);
      });
    // Onglet mémorisé dans l'URL (#statistiques…) : lien partageable, retour arrière cohérent
    const h = window.location.hash.slice(1) as Tab;
    if (ALL_ITEMS.some((i) => i.id === h)) setTabState(h);
  }, []);

  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    setDrawer(false);
    window.history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const current = useMemo(() => ALL_ITEMS.find((i) => i.id === tab)!, [tab]);
  const isAnalytics = tab === "apercu" || tab === "statistiques";

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
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

  return (
    <div className="min-h-screen bg-[#F6EFE1]">
      {/* Barre latérale desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[264px] z-30">
        <Sidebar tab={tab} setTab={setTab} stats={stats} adminName={adminName} onLogout={handleLogout} />
      </aside>

      {/* Tiroir mobile */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              className="lg:hidden fixed inset-y-0 left-0 w-[280px] z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Sidebar tab={tab} setTab={setTab} stats={stats} adminName={adminName} onLogout={handleLogout} />
              <button
                onClick={() => setDrawer(false)}
                aria-label="Fermer le menu"
                className="absolute top-4 -right-12 w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        {/* Barre supérieure */}
        <header className="sticky top-0 z-20 bg-[#F6EFE1]/85 backdrop-blur-xl border-b border-ink/[0.06]">
          {loading && (
            <motion.div
              className="absolute left-0 top-0 h-[2px] bg-coral"
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
          <div className="px-4 sm:px-8 h-[4.5rem] flex items-center gap-3">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-ink/10 bg-white flex items-center justify-center"
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="label-mono !text-[0.58rem] text-muted hidden sm:block">Back-office / {current.label}</p>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">{current.label}</h1>
            </div>

            {isAnalytics && (
              <div className="hidden md:block">
                <SegmentedControl value={range} onChange={setRange} options={RANGES} layoutId="range-pill" />
              </div>
            )}
            <button
              onClick={refresh}
              aria-label="Actualiser"
              className="w-10 h-10 rounded-xl border border-ink/10 bg-white flex items-center justify-center hover:border-ink/30 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            {isAnalytics && stats && (
              <button
                onClick={() => exportCsv(stats)}
                className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-ink text-white text-sm font-semibold hover:bg-coral transition-colors"
              >
                <Download size={15} /> Exporter
              </button>
            )}
            <Link
              href="/"
              className="hidden xl:inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-ink/10 bg-white text-sm font-semibold hover:border-ink/30 transition-colors"
            >
              Voir le site <ExternalLink size={14} />
            </Link>
          </div>
          {isAnalytics && (
            <div className="md:hidden px-4 pb-3 overflow-x-auto">
              <SegmentedControl value={range} onChange={setRange} options={RANGES} layoutId="range-pill-m" />
            </div>
          )}
        </header>

        <main className="px-4 sm:px-8 py-6 sm:py-8 max-w-[1500px]">
          {isAnalytics && (
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <p className="text-sm text-muted">{SUBTITLES[tab]}</p>
              {stats && (
                <p className="label-mono !text-[0.6rem] text-muted">
                  {stats.analytics.range.label} · MAJ {updatedAt?.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          )}

          {!stats ? (
            <SkeletonDashboard />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab + (isAnalytics ? range : "")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: loading && isAnalytics ? 0.6 : 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {tab === "apercu" && <OverviewView a={stats.analytics} onNavigate={(t) => setTab(t as Tab)} />}
                {tab === "statistiques" && <AnalyticsView a={stats.analytics} />}
                {tab === "reservations" && <BookingsTab bookings={stats.bookings} onChanged={refresh} />}
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
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
