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

const fcfa = (v: number) => formatFCFA(Math.round(v));
const int = (v: number) => Math.round(v).toLocaleString("fr-FR");

const ACTIVITY_ICON = {
  booking: { icon: CalendarDays, cls: "bg-series-1/10 text-coral" },
  lesson: { icon: GraduationCap, cls: "bg-series-2/10 text-series-2" },
  order: { icon: ShoppingBag, cls: "bg-series-3/10 text-[#9A6200]" },
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

export default function OverviewView({ a, onNavigate }: { a: Analytics; onNavigate: (tab: string) => void }) {
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
      {/* Alertes */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-wrap gap-2"
        >
          {alerts.map((al) => (
            <button
              key={al.label}
              onClick={() => onNavigate(al.tab)}
              className="inline-flex items-center gap-2 rounded-full border border-coral/25 bg-coral/[0.06] px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-coral hover:text-white hover:border-coral transition-colors"
            >
              <al.icon size={14} className="opacity-80" />
              <span className="tabular">{al.n}</span> {al.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* KPI principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Chiffre d'affaires" kpi={k.revenue} icon={Wallet} format={fcfa} highlight delay={0} />
        <KpiCard label="Réservations terrain" kpi={k.bookings} icon={CalendarDays} format={int} delay={0.05} />
        <KpiCard label="Nouveaux joueurs" kpi={k.newPlayers} icon={UserPlus} format={int} delay={0.1} />
        <KpiCard label="Panier moyen" kpi={k.avgTicket} icon={Receipt} format={fcfa} delay={0.15} />
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
                  <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: off ? "#C9D3D6" : SOURCE_COLORS[s] }} />
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
              <li key={r.source} className="flex items-center justify-between gap-3 text-sm">
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
            className="rounded-2xl bg-white border border-ink/[0.07] p-4 flex items-center gap-3"
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
                    <ProgressBar value={e.fill} color={e.upcoming ? "#E8593B" : "#0B2E3D"} delay={i * 0.05} />
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
    </div>
  );
}
