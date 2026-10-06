"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CalendarCheck,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Quote,
  ShoppingBag,
  Smartphone,
  Trophy,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import HomeImage from "@/components/HomeImage";
import { HOME_IMAGES } from "@/lib/home-images";
import { TARIFFS, formatFCFA } from "@/lib/pricing";
import AdBanner from "@/components/AdBanner";
import PartnerLogos from "@/components/PartnerLogos";
import FeaturedArticles from "@/components/FeaturedArticles";
import ContactForm from "@/components/ContactForm";
import BeachesShowcase from "@/components/BeachesShowcase";
import Reveal from "@/components/RevealFC";
import SplitTitle from "@/components/SplitTitle";
import Counter from "@/components/Counter";
import Marquee from "@/components/Marquee";
import RotatingBadge from "@/components/RotatingBadge";
import ArrowButton from "@/components/ui/ArrowButton";

/* ------------------------------------------------------------------ */
/*  DONNÉES                                                           */
/* ------------------------------------------------------------------ */

const TILES: { n: string; title: string; sub: string; href: string; icon: LucideIcon }[] = [
  { n: "01", title: "Jeu libre", sub: "Votre créneau du week-end", href: "/reservation", icon: CalendarDays },
  { n: "02", title: "Coaching", sub: "Cours avec un coach", href: "/cours", icon: GraduationCap },
  { n: "03", title: "Tournois", sub: "Événements mensuels", href: "/evenements", icon: Trophy },
  { n: "04", title: "Boutique", sub: "Raquettes, balles, tenues", href: "/boutique", icon: ShoppingBag },
];

const STEPS = [
  { icon: MapPin, title: "Choisissez", text: "Votre plage, votre formule et votre créneau : vendredi soir, samedi ou dimanche." },
  { icon: Smartphone, title: "Payez", text: "Réglez en quelques secondes par MTN MoMo ou Moov Money, ou sur place." },
  { icon: QrCode, title: "Jouez", text: "Présentez votre QR code à l'arrivée : matériel fourni, coach sur place." },
];

const TARIFF_ICONS: LucideIcon[] = [Waves, CalendarCheck, Users, Users, Trophy];

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative pt-[calc(var(--nav-height,5rem)+0.5rem)]">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-content gap-12 px-5 pb-16 pt-6 sm:px-6 md:pt-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:pt-8">
            <Reveal from="left">
              <p className="tag-label">Un programme MADES · Saison 2026</p>
            </Reveal>
            <SplitTitle
              text="Vivez l'énergie"
              accent="du beach tennis."
              className="h-display mt-5 text-[clamp(3.2rem,7.2vw,6rem)] text-ink"
              delay={0.1}
            />
            <Reveal delay={350}>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-mutedfg">
                Réservez votre terrain en quelques secondes, progressez avec un coach et rejoignez la communauté la
                plus dynamique des plages de Cotonou.
              </p>
            </Reveal>
            <Reveal delay={450}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ArrowButton href="/reservation" size="lg">
                  Réserver un terrain
                </ArrowButton>
                <ArrowButton href="/evenements" variant="outline" size="lg">
                  Voir les tournois
                </ArrowButton>
              </div>
            </Reveal>

            <Reveal delay={550}>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
                {[
                  { v: 1000, s: " F", l: "La séance de 30 min" },
                  { v: 3, s: " j", l: "Ven. soir, sam. & dim." },
                  { v: 100, s: "%", l: "Paiement Mobile Money" },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col-reverse">
                    <dt className="mt-1 font-mono text-[11px] leading-snug text-mutedfg">{s.l}</dt>
                    <dd className="h-display text-4xl text-ink sm:text-5xl">
                      <Counter value={s.v} grouped={false} />
                      <span className="text-orange">{s.s}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Tuiles coupées en biais, damier blanc / orange (comme la Formation Continue) */}
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-2 gap-2.5">
              {TILES.map((t, i) => {
                const left = i % 2 === 0;
                const orange = i === 1 || i === 2;
                return (
                  <Reveal key={t.n} delay={250 + i * 120} from={left ? "left" : "right"}>
                    <Link
                      href={t.href}
                      className={`group relative flex min-h-[200px] flex-col justify-end overflow-hidden p-5 sm:min-h-[270px] sm:p-6 ${
                        left ? "slant-r" : "slant-l"
                      } ${orange ? "bg-orange text-white" : "bg-white text-ink"}`}
                    >
                      <span
                        className={`${orange ? "court-lines" : "court-lines-dark"} absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-110`}
                      />
                      <t.icon
                        size={200}
                        strokeWidth={0.9}
                        className={`pointer-events-none absolute -right-8 -top-6 transition-all duration-700 ease-out group-hover:-rotate-12 group-hover:scale-110 ${
                          orange ? "text-white/25 group-hover:text-white/40" : "text-ink/[0.07] group-hover:text-orange/30"
                        }`}
                      />
                      <span
                        className={`absolute top-5 inline-flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100 ${
                          orange ? "bg-white text-orange" : "bg-orange text-white"
                        } ${left ? "right-9" : "right-5"}`}
                      >
                        <ArrowUpRight size={18} />
                      </span>
                      <span className={`relative block ${left ? "" : "pl-3"}`}>
                        <span className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] ${orange ? "text-white/85" : "text-orange"}`}>
                          {t.n}
                          <span
                            className={`inline-flex h-7 w-7 animate-floaty items-center justify-center rounded-lg ${
                              orange ? "bg-white/20 text-white" : "bg-orange text-white"
                            }`}
                            style={{ animationDelay: `${i * 0.5}s` }}
                          >
                            <t.icon size={15} />
                          </span>
                        </span>
                        <span className="h-display mt-2 block text-[2rem] transition-transform duration-500 group-hover:translate-x-1 sm:text-[2.6rem]">
                          {t.title}
                        </span>
                        <span className={`h-display mt-0.5 block text-base ${orange ? "text-white/80" : "text-mutedfg"}`}>{t.sub}</span>
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            <div className="absolute -bottom-10 left-1/2 hidden -translate-x-1/2 sm:block">
              <RotatingBadge href="/reservation" text="Réserver · Jouer · Beach Tennis · " light />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BANDEAU INCLINÉ ================= */}
      <section className="relative z-10 mt-6 -rotate-[1.5deg] bg-orange py-5 text-white shadow-glow">
        <Marquee items={["Jeu libre", "Coaching", "Tournois", "Classement", "Boutique"]} outlineEvery className="h-display text-5xl md:text-7xl" />
      </section>

      {/* ================= EN 3 ÉTAPES ================= */}
      <section className="mx-auto max-w-content px-5 py-24 sm:px-6">
        <Reveal>
          <p className="tag-label">Simple comme 1, 2, 3</p>
          <h2 className="h-display mt-4 max-w-2xl text-5xl md:text-6xl">
            Votre créneau <span className="text-orange">en trois étapes.</span>
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-10 hidden h-px border-t-2 border-dashed border-line md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 140}>
              <div className="group relative h-full rounded-card border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-orange hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orangeL text-orange transition-all duration-500 group-hover:bg-orange group-hover:text-white">
                    <s.icon size={28} strokeWidth={1.8} />
                  </span>
                  <span className="h-display text-6xl text-mutedbg transition-colors group-hover:text-orange/20">0{i + 1}</span>
                </div>
                <p className="h-display mt-6 text-3xl">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-mutedfg">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= PLAGES ================= */}
      <BeachesShowcase />

      {/* ================= TARIFS (section sombre) ================= */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-orange/20 blur-3xl" />
        <div className="relative mx-auto max-w-content px-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="tag-label">Les formules</p>
              <h2 className="h-display mt-4 max-w-2xl text-5xl md:text-6xl">
                De la découverte <span className="text-orange">au forfait groupe.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <ArrowButton href="/reservation" variant="ghost">
                Voir les disponibilités
              </ArrowButton>
            </Reveal>
          </div>

          <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="absolute left-[10%] right-[10%] top-[2.25rem] hidden h-0.5 bg-gradient-to-r from-orange/30 via-orange to-orange lg:block" />
            {TARIFFS.map((t, i) => {
              const Icon = TARIFF_ICONS[i] ?? Waves;
              const light = i % 2 === 0;
              return (
                <Reveal key={t.id} delay={i * 110}>
                  <Link
                    href="/reservation"
                    className={`group relative flex h-full flex-col rounded-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow ${
                      light ? "bg-white text-ink" : "bg-orange text-white"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-4 border-ink transition-transform duration-500 group-hover:scale-110 ${
                        light ? "bg-orange text-white" : "bg-white text-orange"
                      }`}
                    >
                      <Icon size={28} />
                    </span>
                    <p className={`mt-5 font-mono text-xs ${light ? "text-orange" : "text-white/80"}`}>Formule {i + 1}</p>
                    <p className="h-display mt-1 text-3xl">{t.label}</p>
                    <p className={`font-mono text-[10px] uppercase tracking-wider ${light ? "text-mutedfg" : "text-white/75"}`}>{t.detail}</p>
                    <p className="h-display mt-auto pt-6 text-4xl">{formatFCFA(t.price)}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ACTUALITÉS + PUB ================= */}
      <FeaturedArticles />
      <section className="mx-auto max-w-content px-5 pt-6 sm:px-6">
        <AdBanner placement="accueil" />
      </section>

      {/* ================= AMBIANCE ================= */}
      <section className="mx-auto max-w-content px-5 py-24 sm:px-6">
        <Reveal>
          <p className="tag-label">L&rsquo;ambiance</p>
          <h2 className="h-display mt-4 max-w-2xl text-5xl md:text-6xl">
            L&rsquo;esprit du club, <span className="text-orange">capturé sur le sable.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {HOME_IMAGES.galerie.map((g, i) => (
            <Reveal key={g.label} delay={i * 100} className={i % 2 === 1 ? "md:mt-12" : ""}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-card">
                <HomeImage src={g.src} alt={g.alt} className="absolute inset-0 h-full w-full" sizes="(max-width: 768px) 50vw, 25vw" hoverScale />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-[11px] text-white/85">0{i + 1}</span>
                <p className="h-display absolute bottom-4 left-4 text-2xl text-white md:text-3xl">{g.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= PAROLE DE COACH ================= */}
      <section className="bg-sand py-24">
        <div className="mx-auto grid max-w-content items-center gap-10 px-5 sm:px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="group relative rounded-card bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift md:p-10">
              <Quote size={36} className="text-orange transition-transform duration-500 group-hover:-rotate-12" />
              <blockquote className="h-display mt-4 text-[2rem] leading-[1.02] text-ink md:text-[2.6rem]">
                &ldquo;Un terrain bien tenu, un accueil chaleureux et un coach passionné : tout ce qu&rsquo;il faut pour
                revenir chaque week-end.&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-semibold">Coach principal</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-mutedfg">Plage de Fidjrossè · Cotonou</p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={150} from="right">
            <div className="slant-l relative aspect-[4/5] overflow-hidden bg-ink">
              <HomeImage src={HOME_IMAGES.terrain.src} alt={HOME_IMAGES.terrain.alt} className="absolute inset-0 h-full w-full" sizes="40vw" hoverScale />
            </div>
          </Reveal>
        </div>
      </section>

      <PartnerLogos />

      {/* ================= DEVENIR PLAGE PARTENAIRE ================= */}
      <section id="partenaires" className="mx-auto max-w-content px-5 py-24 sm:px-6">
        <div className="court-lines relative overflow-hidden rounded-card bg-ink p-8 text-white md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/30 blur-3xl" />
          <div className="relative grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">Développement & partenariats</p>
              <h2 className="h-display mt-3 text-5xl md:text-6xl">
                Installez le terrain <span className="text-orange">sur votre plage.</span>
              </h2>
              <p className="mt-4 max-w-lg text-white/65">
                Restaurants et établissements en bord de mer : accueillez un point Beach Tennis Bénin clé en main —
                matériel, coach et réservations gérés pour vous. Mise en route en 4 à 6 semaines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <ArrowButton href="#contact" size="lg">
                Devenir plage partenaire
              </ArrowButton>
              <RotatingBadge href="#contact" text="Cotonou · Ouidah · Grand-Popo · " />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="mx-auto max-w-content px-5 pb-24 sm:px-6">
        <Reveal>
          <div className="grid gap-10 rounded-card border border-line bg-white p-6 sm:p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="tag-label">Contact</p>
              <h2 className="h-display mt-4 text-5xl md:text-6xl">
                Parlons de <span className="text-orange">votre projet.</span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-mutedfg">
                Réservation de groupe, partenariat plage, question sur les cours : écrivez-nous, on vous répond sous 48h.
              </p>
              <ul className="mt-8 space-y-3 text-sm font-semibold">
                {[
                  { icon: Mail, t: "contact@beachtennisbenin.bj" },
                  { icon: Phone, t: "+229 01 93 23 06 23" },
                  { icon: MapPin, t: "Plages de Cotonou, Bénin" },
                ].map((c) => (
                  <li key={c.t} className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orangeL text-orange">
                      <c.icon size={16} />
                    </span>
                    {c.t}
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
