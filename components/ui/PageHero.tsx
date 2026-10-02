"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import HomeImage from "@/components/HomeImage";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Bandeau d'en-tête des pages intérieures, dans la continuité du hero de
 * l'accueil : fond lagon profond, photo voilée, badge soleil, grand titre
 * Fraunces avec un mot en corail.
 */
export default function PageHero({
  badge,
  icon,
  title,
  accent,
  subtitle,
  image,
  crumbs,
  children,
  aside,
}: {
  badge: string;
  /** Icône du badge, ex. <Waves size={15} /> */
  icon: ReactNode;
  title: string;
  /** Partie du titre affichée en corail (à la suite du titre). */
  accent?: string;
  subtitle?: ReactNode;
  image?: StaticImageData | string;
  crumbs?: { href: string; label: string }[];
  /** Contenu sous le sous-titre (boutons, filtres…). */
  children?: ReactNode;
  /** Colonne de droite (widget). */
  aside?: ReactNode;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);

  return (
    <section className="relative overflow-hidden bg-ink text-white pt-[calc(var(--nav-height,4.5rem)+2.5rem)] md:pt-[calc(var(--nav-height,5rem)+3.5rem)] pb-24 md:pb-28">
      {image && (
        <motion.div style={{ y }} className="absolute inset-0 opacity-40">
          <HomeImage src={image} alt="" className="w-full h-full" sizes="100vw" priority />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/65" />
      <div className="absolute inset-0 court-lines-dark opacity-40 pointer-events-none" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute -top-40 -right-32 w-[30rem] h-[30rem] rounded-full bg-sun/15 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-content mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          {crumbs && crumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              aria-label="Fil d'Ariane"
              className="flex items-center gap-1.5 text-xs text-white/50 mb-5"
            >
              {crumbs.map((c, i) => (
                <span key={c.href} className="inline-flex items-center gap-1.5">
                  <Link href={c.href} className="hover:text-sun transition-colors">
                    {c.label}
                  </Link>
                  {i < crumbs.length - 1 && <ChevronRight size={12} />}
                </span>
              ))}
              <ChevronRight size={12} />
            </motion.nav>
          )}

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sun/10 border border-sun/30 backdrop-blur-md mb-6"
          >
            <span className="text-sun inline-flex">{icon}</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sun">{badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-black leading-[1.02] tracking-tight"
          >
            {title} {accent && <span className="text-coral">{accent}</span>}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
              className="mt-5 text-base md:text-lg text-white/70 max-w-xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.28 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>

        {aside && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="lg:col-span-5"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Conteneur de contenu qui remonte légèrement sur le bandeau (comme la bande de chiffres de l'accueil). */
export function PageBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative z-10 -mt-12 md:-mt-14 max-w-content mx-auto px-6 pb-24 md:pb-28 ${className}`}>{children}</div>;
}
