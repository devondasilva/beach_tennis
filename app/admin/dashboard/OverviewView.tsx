"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  GraduationCap,
  Mail,
  Package,
  PartyPopper,
  Receipt,
  ShoppingBag,
  Trophy,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import type { Analytics, RevenueSource } from "@/lib/analytics";
import { SOURCE_COLORS, SOURCE_ORDER } from "@/lib/chart-theme";
import { formatFCFA } from "@/lib/pricing";
import { Card, DeltaBadge, Empty, KpiCard, ProgressBar, EASE } from "./ui";
import { RevenueChart, SourceDonut } from "./charts";
import { SlideArrow } from "@/components/ui/ArrowButton";

const fcfa = (v: number) => formatFCFA(Math.round(v));
const int = (v: number) => Math.round(v).toLocaleString("fr-FR");

const ACTIVITY_ICON = {
  booking: { icon: CalendarDays, cls: "bg-series-1/10 text-coral" },
  lesson: { icon: GraduationCap, cls: "bg-series-2/10 text-series-2" },
  order: { icon: ShoppingBag, cls: "bg-series-3/10 text-[#13805a]" },
  event: { icon: PartyPopper, cls: "bg-series-4/10 text-series-4" },
  player: { icon: UserPlus, cls: "bg-ink/5 text-ink" },
} as const;

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  const d = Math.floor(diff / 86400);
  return d === 1 ? "hier" : `il y a ${d} j`;
}

interface Counts {
  bookings: number;
  lessons: number;
  events: number;
  products: number;
  orders: number;
  players: number;
}

export default function OverviewView({
  a,
  adminName,
  counts,
  onNavigate,
}: {
  a: Analytics;
  adminName?: string | null;
  counts?: Counts;
  onNavigate: (tab: string) => void;
}) {
  const [hidden, setHidden] = useState<Set<RevenueSource>>(new Set());
  const k = a.kpis;
  const totalBySource = a.revenueBySource.reduce((s, r) => s + r.value, 0);

  const toggle = (s: RevenueSource) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else if (next.size < SOURCE_ORDER.length - 1) next.add(s);
      return next;
    });

  const alerts = [
    { n: a.alerts.unreadMessages, label: "message(s) non lu(s)", icon: Mail, tab: "messages" },
    { n: a.alerts.pendingOrders, label: "commande(s) à livrer", icon: Package, tab: "commandes" },
    { n: a.alerts.lowStock, label: "produit(s) en stock faible", icon: AlertTriangle, tab: "boutique" },
  ].filter((x) => x.n > 0);

  return (
    <div className="space-y-5">
      {/* ===== Bandeau d'accueil (façon Formation Continue) ===== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="court-lines relative overflow-hidden rounded-card bg-ink p-6 text-white sm:p-8"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/30 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">Back-office · Beach Tennis Bénin</p>
            <h1 className="h-display mt-3 text-5xl sm:text-6xl" suppressHydrationWarning>
              {new Date().getHours() < 18 ? "Bonjour" : "Bonsoir"}
              {adminName ? (
                <>
                  , <span className="text-orange">{adminName.split(" ")[0]}.</span>
                </>
              ) : (
                "."
              )}
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Voici l&rsquo;activité des plages sur les {a.range.label.toLowerCase()}. Chaque carte mène directement à l&rsquo;action.
            </p>
          </div>
          {alerts.length > 0 && (
            <div className="flex flex-col items-start gap-2">
              {alerts.map((al, i) => (
                <button
                  key={al.label}
                  onClick={() => onNavigate(al.tab)}
                  className="btn-motion group inline-flex items-center gap-3 rounded-full bg-orange py-1.5 pl-1.5 pr-4 text-sm font-semibold shadow-glow"
                >
                  <span className="btn-fill bg-white/15" aria-hidden />
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-orange ${i === 0 ? "animate-pulseRing" : ""}`}>
                    <al.icon size={15} />
                  </span>
                  <span className="tabular">{al.n}</span> {al.label}
                  <SlideArrow size={14} />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* KPI principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Chiffre d'affaires" kpi={k.revenue} icon={Wallet} format={fcfa} highlight delay={0} />
        <KpiCard label="Réservations terrain" kpi={k.bookings} icon={CalendarDays} format={int} delay={0.05} />
        <KpiCard label="Nouveaux joueurs" kpi={k.newPlayers} icon={UserPlus} format={int} delay={0.1} />
        <KpiCard label="Panier moyen" kpi={k.avgTicket} icon={Receipt} format={fcfa} delay={0.15} />
      </div>

      {/* ===== Actions rapides ===== */}
      <div>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mutedfg">Actions rapides</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: CalendarDays, label: "Réservations", text: `${int(k.bookings.value)} sur la période`, tab: "reservations" },
            { icon: PartyPopper, label: "Programmer un tournoi", text: `${a.alerts.upcomingEvents} à venir`, tab: "evenements" },
            { icon: Package, label: "Livrer les commandes", text: `${a.alerts.pendingOrders} en attente`, tab: "commandes" },
            { icon: Mail, label: "Répondre aux messages", text: `${a.alerts.unreadMessages} non lu${a.alerts.unreadMessages > 1 ? "s" : ""}`, tab: "messages" },
          ].map((q, i) => (
            <motion.button
              key={q.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE }}
              onClick={() => onNavigate(q.tab)}
              className="card group flex items-center gap-3 p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white transition-colors duration-300 group-hover:bg-orange">
                <q.icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{q.label}</span>
                <span className="block truncate text-xs text-mutedfg">{q.text}</span>
              </span>
              <SlideArrow size={15} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recettes + répartition */}
      <div className="grid xl:grid-cols-3 gap-4">
        <Card
          className="xl:col-span-2"
          title="Évolution du chiffre d'affaires"
          subtitle={`${a.range.label} · par ${a.range.granularity === "day" ? "jour" : a.range.granularity === "week" ? "semaine" : "mois"}`}
          delay={0.1}
        >
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrer les sources">
            {SOURCE_ORDER.map((s) => {
              const row = a.revenueBySource.find((r) => r.source === s)!;
              const off = hidden.has(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  aria-pressed={!off}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all ${
                    off ? "border-ink/10 text-muted opacity-60" : "border-ink/10 bg-ink/[0.02] text-ink"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: off ? "#BDBDB8" : SOURCE_COLORS[s] }} />
                  <span className="font-semibold">{row.label}</span>
                  <span className="tabular text-muted">{formatFCFA(row.value)}</span>
                </button>
              );
            })}
          </div>
          <div className="h-[300px]">
            {k.revenue.value > 0 ? (
              <RevenueChart data={a.revenueSeries} hidden={hidden} />
            ) : (
              <Empty>Aucune recette sur cette période.</Empty>
            )}
          </div>
        </Card>

        <Card title="Répartition des recettes" subtitle="Part de chaque activité" delay={0.15}>
          <div className="h-[200px]">
            {totalBySource > 0 ? <SourceDonut data={a.revenueBySource} /> : <Empty>Aucune recette.</Empty>}
          </div>
          <ul className="mt-5 space-y-2.5">
            {a.revenueBySource.map((r) => (
              <li key={r.source} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: SOURCE_COLORS[r.source] }} />
                  {r.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="tabular font-semibold">
                    {totalBySource ? Math.round((r.value / totalBySource) * 100) : 0} %
                  </span>
                  <DeltaBadge delta={r.previous > 0 ? (r.value - r.previous) / r.previous : r.value > 0 ? null : 0} compact />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* KPI secondaires */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cours réservés", kpi: k.lessons, icon: GraduationCap },
          { label: "Commandes boutique", kpi: k.orders, icon: ShoppingBag },
          { label: "Inscriptions tournois", kpi: k.eventRegistrations, icon: Trophy },
          { label: "Joueurs actifs", kpi: k.activePlayers, icon: Users },
        ].map((x, i) => (
          <motion.div
            key={x.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.05 }}
            className="card flex items-center gap-3 p-4"
          >
            <span className="w-10 h-10 rounded-xl bg-ink/[0.04] text-ink flex items-center justify-center shrink-0">
              <x.icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted truncate">{x.label}</p>
              <p className="flex items-center gap-2">
                <span className="text-lg font-bold tabular">{int(x.kpi.value)}</span>
                <DeltaBadge delta={x.kpi.delta} compact />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Événements + activité */}
      <div className="grid xl:grid-cols-3 gap-4">
        <Card
          className="xl:col-span-2"
          title="Remplissage des événements"
          subtitle="Inscriptions / capacité"
          action={
            <button onClick={() => onNavigate("evenements")} className="text-xs font-semibold text-coral hover:underline">
              Gérer
            </button>
          }
          delay={0.2}
        >
          {a.events.length === 0 ? (
            <Empty>Aucun événement.</Empty>
          ) : (
            <ul className="divide-y divide-ink/[0.06]">
              {a.events.slice(0, 6).map((e, i) => (
                <li key={e.id} className="py-3 first:pt-0 last:pb-0 grid grid-cols-12 items-center gap-3">
                  <div className="col-span-12 sm:col-span-5 min-w-0">
                    <p className="text-sm font-semibold truncate">{e.title}</p>
                    <p className="text-xs text-muted">
                      {new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      {e.upcoming ? (
                        <span className="ml-2 inline-flex items-center gap-1 text-coral font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral" /> À venir
                        </span>
                      ) : (
                        <span className="ml-2">Terminé</span>
                      )}
                    </p>
                  </div>
                  <div className="col-span-8 sm:col-span-5">
                    <ProgressBar value={e.fill} color={e.upcoming ? "#FF4D00" : "#0A0A08"} delay={i * 0.05} />
                  </div>
                  <p className="col-span-4 sm:col-span-2 text-right text-sm tabular">
                    <span className="font-semibold">{e.registrations}</span>
                    <span className="text-muted">/{e.capacity}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Activité récente" subtitle="Dernières opérations" delay={0.25} bodyClassName="pt-3">
          {a.activity.length === 0 ? (
            <Empty>Rien pour l&rsquo;instant.</Empty>
          ) : (
            <ol className="relative max-h-[360px] overflow-y-auto scroll-thin pr-1">
              {a.activity.map((it, i) => {
                const meta = ACTIVITY_ICON[it.type];
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex gap-3 py-2.5"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.cls}`}>
                      <meta.icon size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-snug truncate">{it.title}</p>
                      <p className="text-[11px] text-muted truncate">{it.detail}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {it.amount !== null && <p className="text-[12px] font-semibold tabular">{formatFCFA(it.amount)}</p>}
                      <p className="text-[10px] text-muted">{timeAgo(it.at)}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>

      {/* ===== Tous les modules ===== */}
      {counts && (
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-mutedfg">Tous les modules</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: CalendarDays, label: "Réservations", count: counts.bookings, tab: "reservations" },
              { icon: GraduationCap, label: "Cours", count: counts.lessons, tab: "cours" },
              { icon: Trophy, label: "Événements", count: counts.events, tab: "evenements" },
              { icon: ShoppingBag, label: "Boutique", count: counts.products, tab: "boutique" },
              { icon: Package, label: "Commandes", count: counts.orders, tab: "commandes" },
              { icon: Users, label: "Joueurs", count: counts.players, tab: "joueurs" },
            ].map((m) => (
              <button
                key={m.label}
                onClick={() => onNavigate(m.tab)}
                className="card group flex flex-col gap-4 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:shadow-lift"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orangeL text-orange transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-orange group-hover:text-white">
                  <m.icon size={20} />
                </span>
                <span className="flex items-end justify-between gap-2">
                  <span>
                    <span className="block text-sm font-semibold">{m.label}</span>
                    <span className="block font-mono text-[11px] text-mutedfg">{int(m.count)}</span>
                  </span>
                  <SlideArrow size={15} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
