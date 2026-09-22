"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Waves,
  Trophy,
  ArrowRight,
  MapPin,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";
import HeroScene from "@/components/illustrations/HeroScene";
import ActivityJeuLibre from "@/components/illustrations/ActivityJeuLibre";
import ActivityCoaching from "@/components/illustrations/ActivityCoaching";
import ActivityTournoi from "@/components/illustrations/ActivityTournoi";
import GallerySunset from "@/components/illustrations/GallerySunset";
import GalleryTournoi from "@/components/illustrations/GalleryTournoi";
import GalleryCoaching from "@/components/illustrations/GalleryCoaching";
import GalleryEquipement from "@/components/illustrations/GalleryEquipement";

/* ------------------------------------------------------------------ */
/*  DONNÉES                                                           */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "1000 FCFA", label: "Le tarif à la séance (30 min)" },
  { value: "3", label: "Jours d'ouverture — ven · sam · dim" },
  { value: "<2 min", label: "Pour réserver en ligne" },
  { value: "100%", label: "Paiement Mobile Money accepté" },
];

const ACTIVITES = [
  {
    tag: "Jeu libre & forfaits",
    title: "Un terrain équipé, un coach, votre créneau du week-end.",
    desc: "Séance découverte, forfait duo, famille ou groupe : réservez votre créneau, réglez en ligne et recevez votre QR code d'accès immédiat.",
    Illustration: ActivityJeuLibre,
    cta: { href: "/reservation", label: "Réserver un créneau" },
  },
  {
    tag: "Coaching individuel",
    title: "Progressez avec un coach dédié, à votre rythme.",
    desc: "Cours particulier ou en petit groupe, en semaine comme le week-end : le coach adapte chaque séance à votre niveau et à vos objectifs.",
    Illustration: ActivityCoaching,
    cta: { href: "/cours", label: "Réserver un cours" },
  },
  {
    tag: "Tournois mensuels",
    title: "Un rendez-vous chaque mois, des dotations à la clé.",
    desc: "Inscription en ligne, catégories débutants et confirmés, ambiance de plage et prix pour les gagnants — le classement vit toute l'année.",
    Illustration: ActivityTournoi,
    cta: { href: "/evenements", label: "Voir le prochain tournoi" },
  },
];

const GALERIE = [
  { name: "Fin de journée", Illustration: GallerySunset },
  { name: "Tournoi du mois", Illustration: GalleryTournoi },
  { name: "Coaching", Illustration: GalleryCoaching },
  { name: "Équipement", Illustration: GalleryEquipement },
];

const FORMULES = [
  {
    title: "Familles & groupes",
    desc: "Forfaits dégressifs dès 3 joueurs et initiation gratuite pour les débutants accompagnés d'un enfant.",
    icon: <Users size={20} />,
  },
  {
    title: "Joueurs réguliers",
    desc: "Carte 10 séances, abonnement week-end illimité et accès prioritaire aux inscriptions des tournois mensuels.",
    icon: <Trophy size={20} />,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="bg-sandlight text-ink font-body">
      {/* ------------------------------ NOUVEAU HERO REDESIGNÉ ------------------------------ */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-ink text-white">
        {/* Fond d'illustration avec superposition sombre et subtil dégradé corail/soleil */}
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <IllustrationBlock
            Illustration={HeroScene}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />

        <div className="relative z-10 max-w-content mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne de gauche : Texte et CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sun/10 border border-sun/30 backdrop-blur-md mb-6">
              <Sun size={15} className="text-sun animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sun">
              Saison 2026 · Plages de Cotonou
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black leading-[1] tracking-tight mb-6">
              Vivez l&rsquo;énergie du <span className="text-coral">Beach Tennis</span>.
            </h1>

            <p className="text-base md:text-lg text-white/75 max-w-xl leading-relaxed mb-8">
              Réservez votre terrain en quelques secondes, profitez d&rsquo;un équipement professionnel et rejoignez la communauté la plus dynamique du littoral.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/reservation"
                className="px-8 py-4 bg-coral text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-sun hover:text-ink transition-all shadow-lg shadow-coral/20 flex items-center gap-3 group"
              >
                Réserver un terrain
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/evenements"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Découvrir les cours
              </Link>
            </div>
          </motion.div>

          {/* Colonne de droite : Carte d'information rapide style "Widget Flottant" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sun/20 flex items-center justify-center text-sun">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Prochain créneau</p>
                    <p className="text-sm font-bold text-white">Ce weekend (Ven - Dim)</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-coral text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Ouvert
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-white/80">
                  <ShieldCheck size={18} className="text-sun shrink-0" />
                  <span>Matériel de qualité fourni sur place</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin size={18} className="text-sun shrink-0" />
                  <span>Emplacement privilégié sur les côtes de Cotonou</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Trophy size={18} className="text-sun shrink-0" />
                  <span>Tournois et animations chaque fin de mois</span>
                </div>
              </div>

              <Link
                href="/reservation"
                className="w-full py-3.5 bg-sun text-ink font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 text-xs"
              >
                Voir les disponibilités <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------ BANDE DE CHIFFRES ------------------------------ */}
      <section className="relative -mt-6 md:-mt-10 z-10">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-ink/5 border border-ink/5 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink/8">
            {STATS.map((s) => (
              <div key={s.label} className="p-8 text-center">
                <p className="text-2xl md:text-3xl font-display font-black text-coral tracking-tight mb-1">
                  {s.value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ ACTIVITÉS — SPLITS ALTERNÉS ------------------------------ */}
      <section id="activites" className="py-28 md:py-32 space-y-28 md:space-y-32">
        {ACTIVITES.map((a, i) => (
          <div
            key={a.title}
            className={`max-w-content mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coral">
                {a.tag}
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-4 mb-6 leading-tight text-ink">
                {a.title}
              </h3>
              <p className="text-ink/60 leading-relaxed mb-8">{a.desc}</p>
              <Link
                href={a.cta.href}
                className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:text-coral transition-colors"
              >
                {a.cta.label} <ChevronRight size={15} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7"
            >
              <IllustrationBlock
                Illustration={a.Illustration}
                className="aspect-[16/10]"
                clipPath={
                  i % 2 === 0
                    ? "polygon(0 0, 100% 0, 100% 100%, 6% 100%)"
                    : "polygon(0 0, 100% 0, 94% 100%, 0% 100%)"
                }
              />
            </motion.div>
          </div>
        ))}
      </section>

      {/* ------------------------------ STRIP RAPIDE — AUTRES FAÇONS DE JOUER ------------------------------ */}
      <section className="max-w-content mx-auto px-6 pb-8">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink/60 font-semibold">
            Et aussi : la boutique d&rsquo;accessoires, le classement des joueurs et votre carte membre.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/boutique"
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
            >
              Boutique
            </Link>
            <Link
              href="/classement"
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
            >
              Classement
            </Link>
            <Link
              href="/profil"
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
            >
              Mon profil
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------ GALERIE HORIZONTALE ------------------------------ */}
      <section id="galerie" className="py-8 pb-28 md:pb-32">
        <div className="max-w-content mx-auto px-6 mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coral">
            L&rsquo;ambiance
          </span>
          <h3 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-3 text-ink">
            L&rsquo;esprit du club, capturé sur le sable.
          </h3>
        </div>
        <div className="max-w-content mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {GALERIE.map((g) => (
            <motion.div key={g.name} whileHover={{ y: -6 }} className="aspect-[3/4]">
              <IllustrationBlock
                Illustration={g.Illustration}
                className="w-full h-full rounded-[2rem]"
                hoverScale
              />
              <div className="relative -mt-10 pointer-events-none">
                <span className="ml-5 inline-block text-white font-bold uppercase text-xs tracking-widest bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {g.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------ CITATION SUR FOND SOLEIL ------------------------------ */}
      <section className="bg-sun py-24 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Waves size={36} className="mx-auto mb-8 text-ink" />
          <p className="font-display text-2xl md:text-4xl font-black tracking-tight leading-tight text-ink">
            « Un terrain bien tenu, un accueil chaleureux et un coach
            passionné : c&rsquo;est tout ce qu&rsquo;il faut pour donner envie de
            revenir chaque week-end. »
          </p>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-ink/60">
            — Coach principal, plage de Cotonou
          </p>
        </div>
      </section>

      {/* ------------------------------ DEVENIR PLAGE PARTENAIRE ------------------------------ */}
      <section id="partenaires" className="bg-ink py-28 md:py-32 text-white">
        <div className="max-w-content mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-sun">
              Développement &amp; partenariats
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mt-5 mb-8">
              Installez le terrain <br /> <span className="text-sun">sur votre plage.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md mb-10 leading-relaxed">
              Restaurants et établissements en bord de mer : accueillez un
              point Beach Tennis Bénin clé en main — matériel, coach et
              réservations gérés pour vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Investissement partenaire
                </p>
                <p className="font-display font-black text-xl">Aucun matériel à acheter</p>
              </div>
              <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Mise en route
                </p>
                <p className="font-display font-black text-xl text-sun">4 à 6 semaines</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 text-center">
              <Waves size={32} className="mx-auto mb-6 text-sun" />
              <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-4">
                Devenir plage partenaire
              </h3>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Zones prioritaires : Cotonou, Ouidah, Grand-Popo.
              </p>
              <a
                href="#contact"
                className="w-full inline-flex py-5 bg-coral text-white font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-sun hover:text-ink transition-all items-center justify-center gap-3"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ FORMULES ADAPTÉES ------------------------------ */}
      <section id="formules" className="py-28 md:py-32">
        <div className="max-w-content mx-auto px-6">
          <div className="mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coral">
              Pour chaque profil
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-3 text-ink">
              Des formules adaptées à chacun.
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FORMULES.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -5 }}
                className="bg-white border border-ink/8 p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:shadow-coral/10 transition-all"
              >
                <div className="w-14 h-14 bg-sandlight rounded-2xl flex items-center justify-center mb-8 text-coral">
                  {f.icon}
                </div>
                <h4 className="font-display text-2xl font-black mb-4 tracking-tight text-ink">
                  {f.title}
                </h4>
                <p className="text-ink/55 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ CONTACT ------------------------------ */}
      <section id="contact" className="pb-28 md:pb-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-ink rounded-[3.5rem] p-12 md:p-16 text-white grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-6">
                Parlons de votre projet.
              </h3>
              <p className="text-white/60 leading-relaxed mb-8">
                Réservation de groupe, partenariat plage, question sur les
                cours : écrivez-nous, on vous répond sous 48h.
              </p>
              <div className="space-y-3 text-sm font-bold">
                <p className="flex items-center gap-3">
                  <Mail size={16} className="text-sun" /> contact@beachtennisbenin.bj
                </p>
                <p className="flex items-center gap-3">
                  <Phone size={16} className="text-sun" /> +229 XX XX XX XX
                </p>
                <p className="flex items-center gap-3">
                  <MapPin size={16} className="text-sun" /> Plages de Cotonou, Bénin
                </p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Nom complet"
                className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
              />
              <textarea
                placeholder="Décrivez votre demande…"
                rows={3}
                className="w-full bg-white/5 border-2 border-white/10 p-4 rounded-2xl focus:border-sun outline-none transition-all font-bold text-white placeholder:text-white/40"
              />
              <button className="w-full py-4 bg-coral text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-sun hover:text-ink transition-all">
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}