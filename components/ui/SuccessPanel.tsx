"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/** Écran de confirmation animé (réservation, cours, inscription, commande). */
export default function SuccessPanel({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden bg-ink text-white rounded-[2.5rem] p-10 md:p-12 text-center shadow-2xl shadow-ink/20"
    >
      <div className="absolute inset-0 court-lines-dark opacity-40" aria-hidden />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sun/20 blur-3xl" aria-hidden />
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
          className="mx-auto w-16 h-16 rounded-full bg-sun text-ink flex items-center justify-center shadow-lg shadow-sun/30"
        >
          <Check size={30} strokeWidth={3} />
        </motion.div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-sun">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-black tracking-tight">{title}</h2>
        <div className="mt-5 space-y-1 text-white/75">{children}</div>
        {action && <div className="mt-8">{action}</div>}
      </div>
    </motion.div>
  );
}
