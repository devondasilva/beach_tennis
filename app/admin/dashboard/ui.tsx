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
      className={`rounded-2xl bg-white border border-ink/[0.07] shadow-[0_1px_2px_rgba(11,46,61,0.04),0_12px_32px_-20px_rgba(11,46,61,0.18)] ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            {title && <h3 className="text-[15px] font-bold text-ink">{title}</h3>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </motion.section>
  );
}

export function DeltaBadge({ delta, invert = false, compact = false }: { delta: number | null; invert?: boolean; compact?: boolean }) {
  if (delta === null) {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-series-2/10 px-2 py-0.5 text-[11px] font-semibold text-[#0C5B5A]">
        Nouveau
      </span>
    );
  }
  const pct = Math.round(delta * 1000) / 10;
  const flat = Math.abs(pct) < 0.5;
  const good = invert ? pct < 0 : pct > 0;
  const Icon = flat ? Minus : pct > 0 ? ArrowUpRight : ArrowDownRight;
  const tone = flat ? "bg-ink/5 text-muted" : good ? "bg-[#1a7f37]/10 text-[#1a7f37]" : "bg-[#cf222e]/10 text-[#cf222e]";
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
      whileHover={{ y: -3 }}
      className={`group relative overflow-hidden rounded-2xl p-5 border transition-shadow ${
        highlight
          ? "bg-ink text-white border-ink shadow-[0_20px_40px_-20px_rgba(11,46,61,0.6)]"
          : "bg-white border-ink/[0.07] shadow-[0_1px_2px_rgba(11,46,61,0.04),0_12px_32px_-20px_rgba(11,46,61,0.18)] hover:shadow-[0_20px_40px_-20px_rgba(11,46,61,0.3)]"
      }`}
    >
      {highlight && <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-coral/30 blur-3xl" aria-hidden />}
      <div className="relative flex items-start justify-between">
        <p className={`label-mono !text-[0.62rem] ${highlight ? "text-white/60" : "text-muted"}`}>{label}</p>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-8deg] ${
            highlight ? "bg-coral text-white" : "bg-coral/10 text-coral"
          }`}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="relative mt-3 text-[1.75rem] font-bold tracking-tight leading-none">
        <CountUp value={kpi.value} format={format} />
      </p>
      <div className="relative mt-3 flex items-center justify-between gap-2 min-h-[28px]">
        <div className="flex items-center gap-2">
          <DeltaBadge delta={kpi.delta} invert={invertDelta} compact />
          <span className={`text-[11px] whitespace-nowrap ${highlight ? "text-white/50" : "text-muted"}`} title="Comparaison avec la période précédente de même durée">{hint ?? "vs préc."}</span>
        </div>
        {kpi.spark.length > 1 && (
          <div className="w-16 h-7 shrink-0">
            <Sparkline data={kpi.spark} color={highlight ? "#F4A63B" : "#E8593B"} />
          </div>
        )}
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

export function ProgressBar({ value, color = "#E8593B", delay = 0 }: { value: number; color?: string; delay?: number }) {
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
          <div key={i} className="skeleton h-[136px] rounded-2xl" />
        ))}
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="skeleton h-[380px] rounded-2xl xl:col-span-2" />
        <div className="skeleton h-[380px] rounded-2xl" />
      </div>
    </div>
  );
}
