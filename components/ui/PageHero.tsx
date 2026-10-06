"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import HomeImage from "@/components/HomeImage";
import SplitTitle from "@/components/SplitTitle";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * En-tête des pages intérieures, façon MADES Formation Continue :
 * fond papier, étiquette à point orange, grand titre qui monte mot à mot,
 * chapô, actions ; à droite une carte sombre (widget) ou une photo coupée en biais.
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
  asideOnMobile = false,
}: {
  badge: string;
  /** Icône de l'étiquette (optionnelle). */
  icon?: ReactNode;
  title: string;
  /** Partie du titre affichée en orange (à la suite du titre). */
  accent?: string;
  subtitle?: ReactNode;
  image?: StaticImageData | string;
  crumbs?: { href: string; label: string }[];
  /** Contenu sous le sous-titre (boutons, filtres…). */
  children?: ReactNode;
  /** Colonne de droite (widget), affichée dans une carte sombre. */
  aside?: ReactNode;
  /** Afficher aussi le widget sur mobile (sinon desktop uniquement). */
  asideOnMobile?: boolean;
}) {
  const hasSide = Boolean(aside || image);
  return (
    <section className="relative overflow-hidden pt-[calc(var(--nav-height,5rem)+1.5rem)] md:pt-[calc(var(--nav-height,5rem)+2.5rem)]">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="court-lines-dark pointer-events-none absolute inset-x-0 top-0 h-[70%] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-content items-end gap-10 px-5 pb-12 sm:px-6 lg:grid-cols-12">
        <div className={hasSide ? "lg:col-span-7" : "lg:col-span-9"}>
          {crumbs && crumbs.length > 0 && (
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              aria-label="Fil d'Ariane"
              className="mb-5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mutedfg"
            >
              {crumbs.map((c) => (
                <span key={c.href} className="inline-flex items-center gap-1.5">
                  <Link href={c.href} className="transition-colors hover:text-orange">
                    {c.label}
                  </Link>
                  <ChevronRight size={12} />
                </span>
              ))}
            </motion.nav>
          )}

          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="tag-label"
          >
            {icon && <span className="sr-only">{/* icône décorative */}</span>}
            {badge}
          </motion.p>

          <SplitTitle
            text={title}
            accent={accent}
            breakBeforeAccent={false}
            className="h-display mt-4 text-[clamp(2.8rem,7.5vw,5.8rem)] text-ink"
            delay={0.05}
          />

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              className="mt-5 max-w-xl text-[17px] leading-relaxed text-mutedfg"
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>

        {hasSide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className={`lg:col-span-5 ${aside && asideOnMobile ? "" : "hidden lg:block"}`}
          >
            {aside ? (
              <div className="court-lines relative overflow-hidden rounded-card bg-ink text-white shadow-lift">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange/30 blur-3xl" />
                <div className="relative [&>*]:!rounded-none [&>*]:!border-0 [&>*]:!bg-transparent [&>*]:!shadow-none [&>*]:!backdrop-blur-none">
                  {aside}
                </div>
              </div>
            ) : (
              image && (
                <div className="slant-l relative aspect-[5/4] overflow-hidden bg-sand">
                  <HomeImage src={image} alt="" className="absolute inset-0 h-full w-full" sizes="40vw" priority hoverScale />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                </div>
              )
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Conteneur du contenu sous l'en-tête. */
export function PageBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative z-10 mx-auto max-w-content px-5 pb-24 sm:px-6 md:pb-28 ${className}`}>{children}</div>;
}
