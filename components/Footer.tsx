"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Sun, Waves } from "lucide-react";

const NAV = [
  { href: "/reservation", label: "Réserver" },
  { href: "/cours", label: "Cours" },
  { href: "/evenements", label: "Événements" },
  { href: "/plages", label: "Plages" },
  { href: "/boutique", label: "Boutique" },
  { href: "/classement", label: "Classement" },
  { href: "/actualites", label: "Actualités" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden border-t border-sandlight/10 bg-ink text-sandlight">
      <div className="absolute inset-0 court-lines-dark opacity-30 pointer-events-none" aria-hidden />
      <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-sun/10 blur-3xl pointer-events-none" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-content mx-auto px-6 py-16 grid gap-10 md:grid-cols-12"
      >
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Beach Tennis Bénin"
              width={50}
              height={50}
              className="group-hover:rotate-[-8deg] transition-transform duration-500"
            />
            <span className="font-display font-bold text-lg leading-tight">
              BEACH TENNIS
              <br />
              BENIN
            </span>
          </Link>
          <p className="mt-4 text-sm text-sandlight/70 max-w-xs leading-relaxed">
            Un terrain, un coach, une communauté — le beach tennis s&rsquo;installe sur les plages
            de Cotonou, en partenariat avec des restaurants de bord de mer.
          </p>
          <Link
            href="/reservation"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-coral text-white text-xs font-bold uppercase tracking-widest hover:bg-sun hover:text-ink transition-colors"
          >
            <Waves size={15} /> Réserver un terrain
          </Link>
        </div>

        <div className="md:col-span-3">
          <p className="tag-label !text-sun mb-4">Activité</p>
          <p className="text-sm text-sandlight/75 leading-relaxed">
            Vendredi soir, samedi et dimanche.
            <br />
            Cours particuliers en semaine sur réservation.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sun">
            <Sun size={14} className="animate-spin-slow" /> Saison 2026
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="tag-label !text-sun mb-4">Navigation</p>
          <ul className="space-y-2 text-sm text-sandlight/75">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-sun hover:translate-x-1 inline-block transition-all">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="tag-label !text-sun mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-sandlight/75">
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-sun shrink-0" /> contact@beachtennisbenin.bj
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-sun shrink-0" /> +229 01 93 23 06 23
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={15} className="text-sun shrink-0" /> Plages de Cotonou, Bénin
            </li>
          </ul>
        </div>
      </motion.div>

      <div className="relative border-t border-sandlight/10 py-5">
        <p className="text-center text-xs text-sandlight/45 tracking-wide">
          © {new Date().getFullYear()} Beach Tennis Bénin — Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
