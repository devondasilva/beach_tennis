"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/** Titre d'étape numéroté d'un formulaire en plusieurs parties. */
export function StepTitle({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-4 mb-5">
      <span className="w-9 h-9 shrink-0 rounded-xl bg-ink text-sun font-display font-black flex items-center justify-center">
        {n}
      </span>
      <div>
        <h2 className="font-display text-xl md:text-2xl font-black tracking-tight text-ink leading-tight">{title}</h2>
        {hint && <p className="text-sm text-ink/55 mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

/** Pastille « sélectionné » affichée dans le coin d'une carte-option. */
export function SelectedTick({ show }: { show: boolean }) {
  return (
    <motion.span
      initial={false}
      animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-coral text-white flex items-center justify-center"
    >
      <Check size={14} strokeWidth={3} />
    </motion.span>
  );
}

/** Bloc de formulaire animé à l'apparition. */
export function FormSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className="bg-white border border-ink/[0.08] rounded-[2rem] shadow-sm p-6 md:p-8"
    >
      {children}
    </motion.section>
  );
}

/** Ligne du récapitulatif (carte sombre). */
export function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0 text-sm">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold text-right text-white">{value}</span>
    </div>
  );
}
