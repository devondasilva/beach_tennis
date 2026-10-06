"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Marquee from "./Marquee";
import RotatingBadge from "./RotatingBadge";
import ArrowButton from "./ui/ArrowButton";

const COLS = [
  {
    title: "Jouer",
    links: [
      { label: "Réserver un créneau", href: "/reservation" },
      { label: "Cours avec un coach", href: "/cours" },
      { label: "Tournois & événements", href: "/evenements" },
      { label: "Nos plages", href: "/plages" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Classement", href: "/classement" },
      { label: "Actualités", href: "/actualites" },
      { label: "Boutique", href: "/boutique" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { label: "Se connecter", href: "/login" },
      { label: "Mon espace joueur", href: "/profil" },
      { label: "Back-office", href: "/login?next=/admin" },
    ],
  },
];

/** Pied de page façon MADES Formation Continue. */
export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Bandeau défilant */}
      <div className="border-b border-white/10 py-6">
        <Marquee items={["Réserver", "Jouer", "Progresser", "Gagner"]} className="h-display text-6xl text-white/90 md:text-8xl" outlineEvery />
      </div>

      <div className="court-lines relative">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-orange/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-content gap-12 px-5 py-16 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="tag-label">Prêt à jouer ?</p>
            <p className="h-display mt-4 text-5xl md:text-7xl">
              Le sable
              <br />
              <span className="text-orange">vous attend.</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ArrowButton href="/reservation" size="lg">
                Réserver un créneau
              </ArrowButton>
              <RotatingBadge href="/evenements" text="Tournois · Beach Tennis · Bénin · " />
            </div>
            <ul className="mt-10 space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-orange" /> contact@beachtennisbenin.bj
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-orange" /> +229 01 93 23 06 23
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={15} className="text-orange" /> Plages de Cotonou · ven. soir, sam. & dim.
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors hover:text-white">
                        <span className="link-underline">{l.label}</span>
                        <ArrowUpRight
                          size={14}
                          className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-content px-5 sm:px-6">
          <div className="flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="h-display text-2xl">
                Beach Tennis <span className="text-orange">Bénin</span>
              </span>
              <span className="border-l border-white/15 pl-3 font-mono text-[9px] uppercase leading-tight tracking-[0.18em] text-white/50">
                Un programme
                <br />
                MADES
              </span>
            </Link>
            <p className="max-w-xl text-[12px] leading-relaxed text-white/45">
              <strong className="text-white/70">Beach Tennis Bénin</strong> est un programme du Mouvement Africain de
              Développement de l&rsquo;Emploi et du Sport (MADES). Site institutionnel :{" "}
              <a href="https://www.mades.world" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange hover:underline">
                mades.world ↗
              </a>
            </p>
          </div>
          <p className="border-t border-white/10 py-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
            © {new Date().getFullYear()} Beach Tennis Bénin — Réserver · Jouer · Progresser · Gagner
          </p>
        </div>
      </div>
    </footer>
  );
}
