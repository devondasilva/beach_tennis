"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import type { Analytics, RevenueSource } from "@/lib/analytics";
import { CHART, ORANGE_RAMP, SOURCE_COLORS, SOURCE_ORDER, compactFCFA } from "@/lib/chart-theme";
import { formatFCFA } from "@/lib/pricing";

/* ------------------------------------------------------------------ */
/*  Infobulle commune                                                  */
/* ------------------------------------------------------------------ */

function TooltipShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-ink text-white px-3.5 py-2.5 shadow-2xl min-w-[180px] text-xs">
      <p className="label-mono !text-[0.6rem] text-white/50 mb-1.5">{title}</p>
      {children}
    </div>
  );
}

function Row({ color, label, value, strong }: { color?: string; label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-0.5 ${strong ? "font-bold border-t border-white/10 mt-1 pt-1.5" : ""}`}>
      <span className="flex items-center gap-2 text-white/80">
        {color && <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: color }} />}
        {label}
      </span>
      <span className="tabular">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini-courbe (cartes KPI)                                           */
/* ------------------------------------------------------------------ */

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => ({ i, v }));
  const gid = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} isAnimationActive animationDuration={1200} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Recettes par période — barres empilées par source                  */
/* ------------------------------------------------------------------ */

export function RevenueChart({
  data,
  hidden,
}: {
  data: Analytics["revenueSeries"];
  hidden: Set<RevenueSource>;
}) {
  const visible = SOURCE_ORDER.filter((s) => !hidden.has(s));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barCategoryGap={data.length > 40 ? "18%" : "28%"}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART.axis, fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={28}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART.axis, fontSize: 11 }}
          tickFormatter={compactFCFA}
          width={44}
        />
        <Tooltip
          cursor={{ fill: "rgba(10,10,8,0.04)" }}
          content={(p: TooltipProps<number, string>) => {
            if (!p.active || !p.payload?.length) return null;
            const row = p.payload[0].payload as Analytics["revenueSeries"][number];
            const total = visible.reduce((s, k) => s + row[k], 0);
            return (
              <TooltipShell title={row.label}>
                {[...visible].reverse().map((k) => (
                  <Row key={k} color={SOURCE_COLORS[k]} label={LABELS[k]} value={formatFCFA(row[k])} />
                ))}
                <Row label="Total" value={formatFCFA(total)} strong />
              </TooltipShell>
            );
          }}
        />
        {visible.map((k, i) => (
          <Bar
            key={k}
            dataKey={k}
            stackId="rev"
            fill={SOURCE_COLORS[k]}
            stroke="#fff"
            strokeWidth={1}
            radius={0}
            animationDuration={900}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

const LABELS: Record<RevenueSource, string> = {
  terrains: "Terrains",
  cours: "Cours",
  boutique: "Boutique",
  evenements: "Événements",
};

/* ------------------------------------------------------------------ */
/*  Répartition des recettes — anneau                                  */
/* ------------------------------------------------------------------ */

export function SourceDonut({ data }: { data: Analytics["revenueBySource"] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const shown = active !== null ? data[active] : null;
  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="68%"
            outerRadius="94%"
            paddingAngle={data.filter((d) => d.value > 0).length > 1 ? 2 : 0}
            cornerRadius={0}
            stroke="#fff"
            strokeWidth={2}
            startAngle={90}
            endAngle={-270}
            animationDuration={1000}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {data.map((d, i) => (
              <Cell key={d.source} fill={SOURCE_COLORS[d.source]} opacity={active === null || active === i ? 1 : 0.35} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="label-mono !text-[0.6rem] text-muted">{shown ? shown.label : "Total"}</p>
        <p className="text-xl font-bold tabular mt-1">{compactFCFA(shown ? shown.value : total)}</p>
        <p className="text-[11px] text-muted tabular">
          {shown ? `${total ? Math.round((shown.value / total) * 100) : 0} %` : "FCFA"}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Barres horizontales (classements)                                  */
/* ------------------------------------------------------------------ */

export function HBars({
  rows,
  color = "#FF4D00",
}: {
  rows: { label: string; value: number; display: string; sub?: string }[];
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3.5">
      {rows.map((r, i) => (
        <li key={r.label} className="group">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-ink truncate">{r.label}</span>
            <span className="tabular text-ink shrink-0">
              {r.display}
              {r.sub && <span className="text-muted text-xs ml-1.5">{r.sub}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 rounded-full bg-ink/[0.05] overflow-hidden">
            <motion.div
              className="h-full rounded-full group-hover:brightness-110"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / max) * 100}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Affluence jour × créneau — carte de chaleur                        */
/* ------------------------------------------------------------------ */

export function Heatmap({ data }: { data: Analytics["heatmap"] }) {
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
  const shade = (v: number) => {
    if (v === 0 || data.max === 0) return "rgba(10,10,8,0.035)";
    const idx = Math.min(ORANGE_RAMP.length - 1, Math.floor((v / data.max) * (ORANGE_RAMP.length - 1) + 0.0001));
    return ORANGE_RAMP[Math.max(1, idx)];
  };
  if (data.hours.length === 0) return null;
  return (
    <div>
      <div className="overflow-x-auto scroll-thin">
        <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="w-10" />
              {data.hours.map((h) => (
                <th key={h} className="text-[10px] font-medium text-muted tabular pb-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.days.map((d, di) => (
              <tr key={d}>
                <td className="text-[11px] font-semibold text-muted pr-2">{d}</td>
                {data.cells[di].map((v, hi) => (
                  <td key={hi} className="p-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (di * data.hours.length + hi) * 0.006, duration: 0.4 }}
                      onMouseEnter={() => setHover({ d: di, h: hi })}
                      onMouseLeave={() => setHover(null)}
                      className={`h-8 min-w-[2rem] rounded-md cursor-default transition-shadow ${
                        hover?.d === di && hover?.h === hi ? "ring-2 ring-ink ring-offset-1" : ""
                      }`}
                      style={{ backgroundColor: shade(v) }}
                      aria-label={`${d} ${data.hours[hi]} : ${v} séance(s)`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted">
        <span className="tabular min-h-[1rem]">
          {hover
            ? `${data.days[hover.d]} à ${data.hours[hover.h]} — ${data.cells[hover.d][hover.h]} séance(s)`
            : "Survolez une case pour le détail"}
        </span>
        <span className="flex items-center gap-1.5">
          Moins
          {ORANGE_RAMP.slice(1).map((c) => (
            <span key={c} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          Plus
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Croissance de la communauté — aire cumulée                         */
/* ------------------------------------------------------------------ */

export function GrowthChart({ data }: { data: Analytics["playersGrowth"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4D00" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#FF4D00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: CHART.axis, fontSize: 11 }} interval="preserveStartEnd" minTickGap={28} dy={6} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: CHART.axis, fontSize: 11 }} width={36} allowDecimals={false} />
        <Tooltip
          cursor={{ stroke: "#0A0A08", strokeDasharray: "3 3" }}
          content={(p: TooltipProps<number, string>) => {
            if (!p.active || !p.payload?.length) return null;
            const row = p.payload[0].payload as Analytics["playersGrowth"][number];
            return (
              <TooltipShell title={row.label}>
                <Row color="#FF4D00" label="Joueurs inscrits" value={String(row.cumulative)} />
                <Row label="Nouveaux sur la période" value={`+${row.newPlayers}`} />
              </TooltipShell>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="#FF4D00"
          strokeWidth={2}
          fill="url(#growth)"
          animationDuration={1200}
          activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#FF4D00" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Barre 100 % (répartition simple, ex. moyens de paiement)           */
/* ------------------------------------------------------------------ */

export function StackedShare({
  rows,
  colors,
}: {
  rows: { label: string; value: number; display: string }[];
  colors: string[];
}) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3.5 rounded-full overflow-hidden gap-[2px] bg-ink/[0.04]">
        {rows.map((r, i) =>
          r.value > 0 ? (
            <motion.div
              key={r.label}
              title={`${r.label} : ${Math.round((r.value / total) * 100)} %`}
              initial={{ width: 0 }}
              animate={{ width: `${(r.value / total) * 100}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              style={{ backgroundColor: colors[i] }}
            />
          ) : null
        )}
      </div>
      <ul className="mt-4 space-y-2.5">
        {rows.map((r, i) => (
          <li key={r.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: colors[i] }} />
              {r.label}
            </span>
            <span className="tabular">
              <span className="font-semibold">{Math.round((r.value / total) * 100)} %</span>
              <span className="text-muted text-xs ml-2">{r.display}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
