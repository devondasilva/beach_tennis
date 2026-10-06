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
  Plus,
  ChevronRight,
  ChevronsLeft,
  type LucideIcon,
} from "lucide-react";
import { SlideArrow } from "@/components/ui/ArrowButton";
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
  collapsed = false,
  onToggle,
  mobile = false,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  stats: Stats | null;
  adminName: string | null;
  onLogout: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  mobile?: boolean;
}) {
  const mini = collapsed && !mobile;
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      {/* Marque */}
      <div className={`flex h-20 shrink-0 items-center border-b border-white/10 ${mini ? "justify-center px-2" : "justify-between px-5"}`}>
        <Link href="/" className="flex items-center gap-3">
          {mini ? (
            <Image src="/logo.png" alt="Beach Tennis Bénin" width={38} height={38} />
          ) : (
            <>
              <Image src="/logo.png" alt="" width={34} height={34} />
              <span className="leading-none">
                <span className="h-display block whitespace-nowrap text-[1.2rem]">
                  Beach Tennis <span className="text-orange">Bénin</span>
                </span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">Back-office</span>
              </span>
            </>
          )}
        </Link>
        {!mobile && !mini && onToggle && (
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Réduire la barre latérale"
            title="Réduire"
          >
            <ChevronsLeft size={18} />
          </button>
        )}
      </div>

      {/* Action principale toujours visible */}
      <div className={`px-3 pt-4 ${mini ? "flex justify-center" : ""}`}>
        <button
          onClick={() => setTab("evenements")}
          title="Nouvel événement"
          className={`btn-motion group flex w-full items-center gap-2 rounded-xl bg-orange text-sm font-semibold text-white shadow-glow transition-transform active:scale-[0.97] ${
            mini ? "h-11 w-11 justify-center" : "px-3 py-2.5"
          }`}
        >
          <span className="btn-fill bg-white/20" aria-hidden />
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 transition-transform duration-500 group-hover:rotate-90">
            <Plus size={16} strokeWidth={2.5} />
          </span>
          {!mini && (
            <>
              <span className="flex-1 text-left">Nouvel événement</span>
              <SlideArrow size={15} />
            </>
          )}
        </button>
      </div>

      {/* Navigation verticale */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="Navigation du back-office">
        {NAV.map((g) => (
          <div key={g.group} className="mb-3">
            {!mini && <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">{g.group}</p>}
            {mini && <div className="mx-auto mb-2 h-px w-6 bg-white/10" />}
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = tab === it.id;
                const badge = stats && it.badge ? it.badge(stats) : 0;
                return (
                  <li key={it.id}>
                    <button
                      onClick={() => setTab(it.id)}
                      title={mini ? it.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex w-full items-center gap-3 rounded-xl py-2 text-sm font-medium transition-colors ${
                        mini ? "justify-center px-0" : "px-3"
                      } ${active ? "text-white" : "text-white/60 hover:bg-white/[0.06] hover:text-white"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId={mobile ? "side-active-m" : "side-active"}
                          className="absolute inset-0 rounded-xl bg-orange shadow-glow"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span
                        className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                          active ? "bg-white/20" : "bg-white/[0.06] group-hover:scale-110 group-hover:bg-white/10"
                        }`}
                      >
                        <it.icon size={17} strokeWidth={2} />
                      </span>
                      {!mini && <span className="relative flex-1 text-left">{it.label}</span>}
                      {!mini && !active && badge === 0 && (
                        <ChevronRight
                          size={15}
                          className="relative -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"
                        />
                      )}
                      {badge > 0 && (
                        <span
                          className={`relative min-w-[1.25rem] rounded-full px-1.5 text-center font-mono text-[10px] leading-5 ${
                            active ? "bg-white text-orange" : "bg-orange text-white"
                          } ${mini ? "!absolute -right-0.5 -top-0.5" : ""}`}
                        >
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

      {/* Pied : profil + raccourcis */}
      <div className="shrink-0 border-t border-white/10 p-3">
        {!mini && (
          <button
            onClick={() => setTab("compte")}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors ${
              tab === "compte" ? "bg-white/[0.12]" : "bg-white/[0.05] hover:bg-white/[0.08]"
            }`}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange text-sm font-semibold">
              {(adminName ?? "A").charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{adminName ?? "Administrateur"}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-white/40">Mon compte</span>
            </span>
          </button>
        )}
        <div className={`flex gap-1 ${mini ? "flex-col items-center" : ""}`}>
          <a
            href="/"
            target="_blank"
            className={`flex items-center gap-2 rounded-xl py-2 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white ${
              mini ? "justify-center px-2" : "flex-1 px-3"
            }`}
            title="Voir le site"
          >
            <ExternalLink size={15} /> {!mini && "Voir le site"}
          </a>
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 rounded-xl py-2 text-xs font-semibold text-white/60 transition-colors hover:bg-danger hover:text-white ${
              mini ? "justify-center px-2" : "px-3"
            }`}
            title="Déconnexion"
          >
            <LogOut size={15} /> {!mini && "Déconnexion"}
          </button>
        </div>
        {mini && onToggle && (
          <button
            onClick={onToggle}
            className="mx-auto mt-2 flex rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="Déplier la barre latérale"
            title="Déplier"
          >
            <ChevronsLeft size={18} className="rotate-180" />
          </button>
        )}
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
  const [collapsed, setCollapsed] = useState(false);
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
    try {
      setCollapsed(localStorage.getItem("btb-sidebar") === "1");
    } catch {}
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

  function toggleSidebar() {
    setCollapsed((c) => {
      try {
        localStorage.setItem("btb-sidebar", c ? "0" : "1");
      } catch {}
      return !c;
    });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const current = useMemo(() => ALL_ITEMS.find((i) => i.id === tab)!, [tab]);
  const isAnalytics = tab === "apercu" || tab === "statistiques";

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <div className="card max-w-sm p-8 text-center">
          <p className="h-display text-3xl">Session expirée</p>
          <p className="mt-2 text-sm text-mutedfg">Reconnectez-vous pour continuer.</p>
          <a href="/login?next=/admin" className="mt-6 inline-flex rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white shadow-glow">
            Me reconnecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Barre latérale desktop (repliable) */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 84 : 272 }}
        transition={{ type: "spring", stiffness: 300, damping: 34 }}
        className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden lg:block"
      >
        <Sidebar
          tab={tab}
          setTab={setTab}
          stats={stats}
          adminName={adminName}
          onLogout={handleLogout}
          collapsed={collapsed}
          onToggle={toggleSidebar}
        />
      </motion.aside>

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
              <Sidebar tab={tab} setTab={setTab} stats={stats} adminName={adminName} onLogout={handleLogout} mobile />
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

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-[84px]" : "lg:pl-[272px]"}`}>
        {/* Barre supérieure */}
        <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-xl">
          {loading && (
            <motion.div
              className="absolute left-0 top-0 h-0.5 bg-orange"
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          )}
          <div className="flex h-16 items-center gap-3 px-4 sm:px-8">
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
            <nav className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-mutedfg" aria-label="Fil d'Ariane">
              <button onClick={() => setTab("apercu")} className="hidden hover:text-ink sm:inline">
                Back-office
              </button>
              <ChevronRight size={14} className="hidden shrink-0 sm:block" />
              <span className="truncate font-semibold text-ink">{current.label}</span>
            </nav>

            {isAnalytics && (
              <div className="hidden md:block">
                <SegmentedControl value={range} onChange={setRange} options={RANGES} layoutId="range-pill" />
              </div>
            )}
            <button
              onClick={refresh}
              aria-label="Actualiser"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-ink/30"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            {isAnalytics && stats && (
              <button
                onClick={() => exportCsv(stats)}
                className="btn-motion hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white sm:inline-flex"
              >
                <span className="btn-fill bg-orange" aria-hidden />
                <Download size={15} /> Exporter
              </button>
            )}
            <p suppressHydrationWarning className="hidden font-mono text-[11px] uppercase tracking-wider text-mutedfg 2xl:block">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {isAnalytics && (
            <div className="overflow-x-auto px-4 pb-3 md:hidden">
              <SegmentedControl value={range} onChange={setRange} options={RANGES} layoutId="range-pill-m" />
            </div>
          )}
        </header>

        <main className="mx-auto max-w-[88rem] overflow-x-clip px-4 py-6 sm:px-8 sm:py-8">
          {tab === "statistiques" && (
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
                {tab === "apercu" && (
                  <OverviewView
                    a={stats.analytics}
                    adminName={adminName}
                    counts={{
                      bookings: stats.bookings.length,
                      lessons: stats.lessons.length,
                      events: stats.events.length,
                      products: stats.products.length,
                      orders: stats.orders.length,
                      players: stats.players.length,
                    }}
                    onNavigate={(t) => setTab(t as Tab)}
                  />
                )}
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
