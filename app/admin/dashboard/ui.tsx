"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import CountUp from "@/components/motion/CountUp";
import type { Kpi } from "@/lib/analytics";
import { Sparkline } from "./charts";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
  delay = 0,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`card min-w-0 transition-shadow duration-500 hover:shadow-soft ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            {title && (
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}

export function DeltaBadge({ delta, invert = false, compact = false, onDark = false }: { delta: number | null; invert?: boolean; compact?: boolean; onDark?: boolean }) {
  if (delta === null) {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-series-2/10 px-2 py-0.5 text-[11px] font-semibold text-[#1d5fae]">
        Nouveau
      </span>
    );
  }
  const pct = Math.round(delta * 1000) / 10;
  const flat = Math.abs(pct) < 0.5;
  const good = invert ? pct < 0 : pct > 0;
  const Icon = flat ? Minus : pct > 0 ? ArrowUpRight : ArrowDownRight;
  const tone = onDark ? "bg-white/20 text-white" : flat ? "bg-ink/5 text-muted" : good ? "bg-[#1a7f37]/10 text-[#1a7f37]" : "bg-[#cf222e]/10 text-[#cf222e]";
  return (
    <span className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold tabular ${tone}`}>
      <Icon size={12} strokeWidth={2.5} />
      {pct > 0 ? "+" : ""}
      {pct.toLocaleString("fr-FR")} %{!compact && <span className="sr-only"> par rapport à la période précédente</span>}
    </span>
  );
}

export function KpiCard({
  label,
  kpi,
  icon: Icon,
  format,
  invertDelta,
  highlight = false,
  delay = 0,
  hint,
}: {
  label: string;
  kpi: Kpi;
  icon: LucideIcon;
  format?: (v: number) => string;
  invertDelta?: boolean;
  highlight?: boolean;
  delay?: number;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-card p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
        highlight ? "bg-orange text-white" : "border border-line bg-white"
      }`}
    >
      <Icon
        size={110}
        strokeWidth={1}
        className={`pointer-events-none absolute -bottom-5 -right-5 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110 ${
          highlight ? "text-white/15" : "text-ink/[0.04]"
        }`}
      />
      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-[-8deg] ${
            highlight ? "bg-white text-orange" : "bg-orangeL text-orange"
          }`}
        >
          <Icon size={21} />
        </span>
        {kpi.spark.length > 1 && (
          <div className="h-8 w-20 shrink-0">
            <Sparkline data={kpi.spark} color={highlight ? "#FFFFFF" : "#FF4D00"} />
          </div>
        )}
      </div>
      <div className="relative mt-6">
        <p className={`font-mono text-[11px] uppercase tracking-wider ${highlight ? "text-white/75" : "text-mutedfg"}`}>{label}</p>
        <p className="h-display mt-1 text-4xl leading-none">
          <CountUp value={kpi.value} format={format} />
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DeltaBadge delta={kpi.delta} invert={invertDelta} compact onDark={highlight} />
          <span
            className={`whitespace-nowrap text-[11px] ${highlight ? "text-white/70" : "text-mutedfg"}`}
            title="Comparaison avec la période précédente de même durée"
          >
            {hint ?? "vs période préc."}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  layoutId,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  layoutId: string;
}) {
  return (
    <div className="inline-flex rounded-full bg-ink/[0.05] p-1" role="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? "text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value, color = "#FF4D00", delay = 0 }: { value: number; color?: string; delay?: number }) {
  return (
    <div className="h-2 rounded-full bg-ink/[0.06] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
        transition={{ duration: 1, ease: EASE, delay }}
      />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 text-sm text-muted">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-ink/15 mb-3" />
      {children}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-[170px] rounded-card" />
        ))}
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="skeleton h-[380px] rounded-card xl:col-span-2" />
        <div className="skeleton h-[380px] rounded-card" />
      </div>
    </div>
  );
}
