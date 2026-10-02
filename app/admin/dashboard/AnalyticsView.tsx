"use client";

import { motion } from "framer-motion";
import { Ban, Medal, Star, Timer, Users } from "lucide-react";
import type { Analytics } from "@/lib/analytics";
import { formatFCFA } from "@/lib/pricing";
import { Card, Empty, KpiCard, EASE } from "./ui";
import { GrowthChart, HBars, Heatmap, StackedShare } from "./charts";

const int = (v: number) => Math.round(v).toLocaleString("fr-FR");
const pct = (v: number) => `${(Math.round(v * 1000) / 10).toLocaleString("fr-FR")} %`;
const LEVEL_COLORS = ["#F4A63B", "#E8593B", "#12807F"];
const NEUTRALS = ["#0B2E3D", "#4E6670", "#C9D3D6"];

export default function AnalyticsView({ a }: { a: Analytics }) {
  const k = a.kpis;
  const busiest = (() => {
    let best = { d: -1, h: -1, v: 0 };
    a.heatmap.cells.forEach((row, d) => row.forEach((v, h) => v > best.v && (best = { d, h, v })));
    return best.v > 0 ? `${a.heatmap.days[best.d]} · ${a.heatmap.hours[best.h]}` : "—";
  })();
  const ratedBeaches = a.bookingsByBeach.filter((b) => b.rating !== null);
  const avgRating = ratedBeaches.length
    ? ratedBeaches.reduce((s, b) => s + (b.rating ?? 0) * b.reviews, 0) / Math.max(1, ratedBeaches.reduce((s, b) => s + b.reviews, 0))
    : 0;

  return (
    <div className="space-y-5">
      {/* Indicateurs de qualité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Joueurs actifs" kpi={k.activePlayers} icon={Users} format={int} hint="payants" />
        <KpiCard label="Taux d'annulation" kpi={k.cancellationRate} icon={Ban} format={pct} invertDelta delay={0.05} />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="rounded-2xl p-5 bg-white border border-ink/[0.07]"
        >
          <div className="flex items-start justify-between">
            <p className="label-mono !text-[0.62rem] text-muted">Créneau le plus demandé</p>
            <span className="w-9 h-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
              <Timer size={17} />
            </span>
          </div>
          <p className="mt-3 text-[1.75rem] font-bold leading-none">{busiest}</p>
          <p className="mt-3 text-[11px] text-muted">Terrains et cours confondus</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="rounded-2xl p-5 bg-white border border-ink/[0.07]"
        >
          <div className="flex items-start justify-between">
            <p className="label-mono !text-[0.62rem] text-muted">Satisfaction (avis)</p>
            <span className="w-9 h-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
              <Star size={17} />
            </span>
          </div>
          <p className="mt-3 text-[1.75rem] font-bold leading-none tabular">
            {avgRating ? avgRating.toLocaleString("fr-FR", { maximumFractionDigits: 1 }) : "—"}
            <span className="text-base text-muted font-semibold"> / 5</span>
          </p>
          <div className="mt-3 flex gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className={i <= Math.round(avgRating) ? "fill-coral text-coral" : "text-ink/15"} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Affluence + formules */}
      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" title="Affluence par jour et créneau" subtitle="Nombre de séances (terrains + cours)" delay={0.1}>
          {a.heatmap.max > 0 ? <Heatmap data={a.heatmap} /> : <Empty>Pas encore de séance sur la période.</Empty>}
        </Card>
        <Card title="Formules les plus réservées" subtitle="Réservations de terrain" delay={0.15}>
          {a.tariffMix.length ? (
            <HBars
              rows={a.tariffMix.map((t) => ({ label: t.label, value: t.count, display: int(t.count), sub: formatFCFA(t.revenue) }))}
            />
          ) : (
            <Empty>Aucune réservation.</Empty>
          )}
        </Card>
      </div>

      {/* Plages, paiements, niveaux */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="lg:col-span-2" title="Performance par plage" subtitle="Chiffre d'affaires terrains, réservations et note moyenne" delay={0.15}>
          {a.bookingsByBeach.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left label-mono !text-[0.6rem] text-muted">
                    <th className="pb-3 font-medium">Plage</th>
                    <th className="pb-3 font-medium text-right">Résa.</th>
                    <th className="pb-3 font-medium text-right">CA</th>
                    <th className="pb-3 font-medium text-right">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/[0.06]">
                  {a.bookingsByBeach.map((b, i) => {
                    const max = Math.max(1, ...a.bookingsByBeach.map((x) => x.revenue));
                    return (
                      <tr key={b.beachId}>
                        <td className="py-3 pr-3 min-w-[10rem]">
                          <p className="font-semibold">{b.name}</p>
                          <div className="mt-1.5 h-1.5 rounded-full bg-ink/[0.05] overflow-hidden">
                            <motion.div
                              className="h-full bg-coral rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(b.revenue / max) * 100}%` }}
                              transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
                            />
                          </div>
                        </td>
                        <td className="py-3 text-right tabular">{int(b.bookings)}</td>
                        <td className="py-3 text-right tabular font-semibold whitespace-nowrap">{formatFCFA(b.revenue)}</td>
                        <td className="py-3 text-right tabular whitespace-nowrap">
                          {b.rating !== null ? (
                            <span className="inline-flex items-center gap-1">
                              <Star size={12} className="fill-coral text-coral" />
                              {b.rating.toLocaleString("fr-FR")}
                              <span className="text-muted text-xs">({b.reviews})</span>
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>Aucune plage configurée.</Empty>
          )}
        </Card>
        <Card title="Moyens de paiement" subtitle="Terrains + cours" delay={0.2}>
          <StackedShare
            rows={a.paymentMix.map((p) => ({ label: p.label, value: p.count, display: formatFCFA(p.amount) }))}
            colors={NEUTRALS}
          />
        </Card>
        <Card title="Niveau des joueurs" subtitle="Toute la communauté" delay={0.25}>
          <StackedShare rows={a.levels.map((l) => ({ label: l.label, value: l.count, display: `${l.count} joueurs` }))} colors={LEVEL_COLORS} />
        </Card>
      </div>

      {/* Croissance + top joueurs */}
      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2" title="Croissance de la communauté" subtitle="Joueurs inscrits (cumul)" delay={0.2}>
          <div className="h-[280px]">
            <GrowthChart data={a.playersGrowth} />
          </div>
        </Card>
        <Card title="Meilleurs joueurs" subtitle="Dépenses sur la période" delay={0.25}>
          {a.topPlayers.some((p) => p.spent > 0) ? (
            <ol className="space-y-3">
              {a.topPlayers
                .filter((p) => p.spent > 0)
                .map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0 ? "bg-coral text-white" : i < 3 ? "bg-ink text-white" : "bg-ink/[0.05] text-ink"
                      }`}
                    >
                      {i < 3 ? <Medal size={14} /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-[11px] text-muted">
                        {p.visits} passage(s) · {int(p.points)} pts
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular whitespace-nowrap">{formatFCFA(p.spent)}</p>
                  </li>
                ))}
            </ol>
          ) : (
            <Empty>Aucun achat sur la période.</Empty>
          )}
        </Card>
      </div>

      {/* Coachs + boutique */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Activité des coachs" subtitle="Cours donnés sur la période" delay={0.25}>
          {a.coaches.length ? (
            <HBars
              color="#00908C"
              rows={a.coaches.map((c) => ({ label: c.name, value: c.lessons, display: `${c.lessons} cours`, sub: formatFCFA(c.revenue) }))}
            />
          ) : (
            <Empty>Aucun cours sur la période.</Empty>
          )}
        </Card>
        <Card title="Ventes boutique" subtitle="Produits les plus vendus · stock restant" delay={0.3}>
          {a.topProducts.some((p) => p.qty > 0) ? (
            <HBars
              color="#E39B1B"
              rows={a.topProducts
                .filter((p) => p.qty > 0)
                .map((p) => ({ label: p.name, value: p.revenue, display: formatFCFA(p.revenue), sub: `${p.qty} vendus · stock ${p.stock}` }))}
            />
          ) : (
            <Empty>Aucune vente sur la période.</Empty>
          )}
        </Card>
      </div>
    </div>
  );
}
