"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, GraduationCap, LogOut, ShoppingBag, Trophy, UserCircle } from "lucide-react";
import { formatFCFA } from "@/lib/pricing";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import PageLoading from "@/components/ui/PageLoading";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

interface Player {
  id: string;
  name: string;
  phone: string;
  level: string;
  loyaltyPoints: number;
}
interface Booking {
  id: string;
  beachName: string;
  tariffLabel: string;
  date: string;
  time: string;
  price: number;
}
interface Lesson {
  id: string;
  formulaLabel: string;
  coach: string;
  date: string;
  time: string;
  price: number;
}
interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}
interface EventReg {
  id: string;
  title: string;
  date: string;
}

interface ProfileData {
  player: Player;
  bookings: Booking[];
  lessons: Lesson[];
  orders: Order[];
  events: EventReg[];
}

const LEVEL_LABEL: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  confirme: "Confirmé",
};

export default function ProfilClient() {
  const router = useRouter();
  const params = useSearchParams();
  const explicitId = params.get("playerId") ?? "";

  const [isOwnSession, setIsOwnSession] = useState(false);
  const [resolvedId, setResolvedId] = useState<string | null>(explicitId || null);
  const [resolving, setResolving] = useState(!explicitId);

  const [data, setData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si aucun lien personnel n'est fourni dans l'URL, on regarde s'il existe
  // une session joueur active (connecté via /login) pour charger son propre profil.
  useEffect(() => {
    if (explicitId) return;
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.session?.role === "player") {
          setIsOwnSession(true);
          setResolvedId(d.session.id);
        }
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [explicitId]);

  useEffect(() => {
    if (!resolvedId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/players/${resolvedId}`)
      .then(async (res) => {
        const d = await res.json();
        if (!res.ok) {
          setError(d.error ?? "Profil introuvable.");
          return;
        }
        setData(d);
      })
      .finally(() => setLoading(false));
  }, [resolvedId]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (resolving || (resolvedId && !data && !error)) return <PageLoading />;

  if (!resolvedId || error || !data) {
    return (
      <div className="bg-sandlight">
        <PageHero
          badge="Mon profil"
          icon={<UserCircle size={15} />}
          title="Retrouvez votre"
          accent="espace."
          subtitle="QR code, points de fidélité et historique de vos séances, cours, commandes et tournois."
          image={PAGE_IMAGES.compte}
          crumbs={[{ href: "/", label: "Accueil" }]}
        />
        <PageBody>
          <Reveal className={`${ui.card} max-w-xl mx-auto p-10 text-center`}>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-ink text-sun flex items-center justify-center">
              <UserCircle size={28} />
            </div>
            {error ? (
              <p className={`mt-6 ${ui.error}`}>{error}</p>
            ) : (
              <p className="mt-6 text-ink/60 leading-relaxed">
                Connectez-vous depuis la page de connexion, ou utilisez le lien personnel reçu après une
                réservation, un cours, une commande ou une inscription à un événement.
              </p>
            )}
            <Link href="/login" className={`mt-8 ${ui.btnPrimary}`}>
              Se connecter
            </Link>
          </Reveal>
        </PageBody>
      </div>
    );
  }

  const { player, bookings, lessons, orders, events } = data;
  const nextReward = 200 - (player.loyaltyPoints % 200);
  const progress = (player.loyaltyPoints % 200) / 200;
  const totalSpent =
    bookings.reduce((s, b) => s + b.price, 0) + lessons.reduce((s, l) => s + l.price, 0) + orders.reduce((s, o) => s + o.total, 0);

  const sections: {
    icon: typeof CalendarDays;
    title: string;
    empty: string;
    cta?: { href: string; label: string };
    items: { key: string; main: string; sub: string; amount?: number }[];
  }[] = [
    {
      icon: CalendarDays,
      title: "Réservations",
      empty: "Aucune réservation pour le moment.",
      cta: { href: "/reservation", label: "Réserver un créneau" },
      items: bookings.map((b) => ({ key: b.id, main: b.tariffLabel, sub: `${b.beachName} · ${b.date} à ${b.time}`, amount: b.price })),
    },
    {
      icon: GraduationCap,
      title: "Cours avec un coach",
      empty: "Aucun cours réservé pour le moment.",
      cta: { href: "/cours", label: "Réserver un cours" },
      items: lessons.map((l) => ({ key: l.id, main: l.formulaLabel, sub: `avec ${l.coach} · ${l.date} à ${l.time}`, amount: l.price })),
    },
    {
      icon: Trophy,
      title: "Événements",
      empty: "Aucune inscription à un tournoi pour le moment.",
      cta: { href: "/evenements", label: "Voir les événements" },
      items: events.map((e) => ({ key: e.id, main: e.title, sub: e.date })),
    },
    {
      icon: ShoppingBag,
      title: "Commandes boutique",
      empty: "Aucune commande pour le moment.",
      cta: { href: "/boutique", label: "Voir la boutique" },
      items: orders.map((o) => ({ key: o.id, main: o.items.map((i) => `${i.qty}× ${i.name}`).join(", "), sub: "Retrait au stand du coach", amount: o.total })),
    },
  ];

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Mon espace joueur"
        icon={<UserCircle size={15} />}
        title="Bonjour"
        accent={`${player.name.split(" ")[0]}.`}
        subtitle="Votre carte membre, vos points de fidélité et tout votre historique au même endroit."
        image={PAGE_IMAGES.compte}
        crumbs={[{ href: "/", label: "Accueil" }]}
      >
        <div className="flex flex-wrap gap-3">
          {[
            { v: bookings.length, l: "séances" },
            { v: lessons.length, l: "cours" },
            { v: events.length, l: "tournois" },
          ].map((x) => (
            <span key={x.l} className="inline-flex items-baseline gap-1.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm">
              <span className="font-display text-lg font-black text-sun">{x.v}</span> {x.l}
            </span>
          ))}
        </div>
      </PageHero>

      <PageBody>
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <Reveal className="lg:col-span-4 lg:sticky lg:top-[calc(var(--nav-height,4.5rem)+1.5rem)]">
            <div className="relative overflow-hidden rounded-card bg-ink text-sandlight p-7 text-center shadow-xl shadow-ink/20">
              <div className="absolute inset-0 court-lines opacity-40" aria-hidden />
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/20 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Carte membre</p>
                <h1 className="font-display text-2xl font-black mt-2">{player.name}</h1>
                <p className="text-sandlight/60 text-sm">{player.phone}</p>
                <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest bg-sun/15 text-sun px-3 py-1 rounded-full">
                  {LEVEL_LABEL[player.level] ?? player.level}
                </span>

                <motion.div
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="mt-6 bg-white rounded-2xl p-3 inline-block shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/qrcode/${player.id}`} alt={`QR code d'enregistrement de ${player.name}`} width={170} height={170} />
                </motion.div>
                <p className="mt-2 text-[11px] text-sandlight/50">À présenter à l&rsquo;arrivée sur la plage</p>

                <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 text-left">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-sandlight/50">Points de fidélité</p>
                      <p className="font-display text-4xl font-black text-sun">{player.loyaltyPoints}</p>
                    </div>
                    <Trophy size={28} className="text-sun/60" />
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-sun"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-sandlight/60">
                    Encore <span className="font-bold text-sun">{nextReward} pts</span> pour une séance offerte
                  </p>
                </div>

                <p className="mt-5 text-xs text-sandlight/50">
                  Total dépensé : <span className="font-semibold text-sandlight/80">{formatFCFA(totalSpent)}</span>
                </p>

                {isOwnSession && (
                  <button
                    onClick={handleLogout}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sandlight/60 hover:text-coral transition-colors"
                  >
                    <LogOut size={14} /> Se déconnecter
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-8 space-y-6">
            {sections.map((sec, i) => (
              <Reveal key={sec.title} delay={i * 0.06} className={`${ui.card} p-6 md:p-7`}>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="flex items-center gap-3 font-display text-xl md:text-2xl font-black tracking-tight text-ink">
                    <span className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                      <sec.icon size={18} />
                    </span>
                    {sec.title}
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-ink/40">{sec.items.length}</span>
                </div>
                {sec.items.length === 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sandlight px-5 py-4">
                    <p className="text-sm text-ink/60">{sec.empty}</p>
                    {sec.cta && (
                      <Link href={sec.cta.href} className="text-xs font-bold uppercase tracking-widest text-coral hover:underline">
                        {sec.cta.label} →
                      </Link>
                    )}
                  </div>
                ) : (
                  <ul className="divide-y divide-ink/[0.06]">
                    {sec.items.map((it) => (
                      <li key={it.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-sm truncate">{it.main}</p>
                          <p className="text-xs text-ink/50 truncate">{it.sub}</p>
                        </div>
                        {it.amount !== undefined && <span className="font-bold text-ink text-sm whitespace-nowrap">{formatFCFA(it.amount)}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </PageBody>
    </div>
  );
}
