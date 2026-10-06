"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, ChevronLeft, MapPin, MessageSquare, Waves } from "lucide-react";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";
import BeachDefault from "@/components/illustrations/BeachDefault";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import PageLoading from "@/components/ui/PageLoading";
import EmptyState from "@/components/ui/EmptyState";
import Stars from "@/components/ui/Stars";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";
import ReviewForm from "./ReviewForm";

interface Beach {
  id: string;
  name: string;
  location: string;
  description: string;
  amenities: string[];
  images: string[];
  active: boolean;
}
interface Review {
  id: string;
  playerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function BeachDetailPage({ params }: { params: { id: string } }) {
  const [beach, setBeach] = useState<Beach | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const load = useCallback(() => {
    fetch(`/api/beaches/${params.id}`).then(async (r) => {
      if (!r.ok) {
        setNotFound(true);
        return;
      }
      const d = await r.json();
      setBeach(d.beach);
      setReviews(d.reviews);
      setRating(d.rating);
    });
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (notFound) {
    return (
      <div className="bg-sandlight">
        <PageHero badge="Nos plages" icon={<Waves size={15} />} title="Plage" accent="introuvable." image={PAGE_IMAGES.plages} />
        <PageBody>
          <EmptyState icon={<Waves size={24} />} title="Cette plage n'existe plus">
            <Link href="/plages" className="text-coral font-bold hover:underline">
              Voir toutes les plages
            </Link>
          </EmptyState>
        </PageBody>
      </div>
    );
  }

  if (!beach) return <PageLoading />;

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Fiche plage"
        icon={<Waves size={15} />}
        title={beach.name}
        image={beach.images[0] ?? PAGE_IMAGES.plages}
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/plages", label: "Plages" },
        ]}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} className="text-sun" /> {beach.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Stars rating={rating.average} size={15} />
              <span className="text-sm">{rating.count > 0 ? `${rating.average}/5 · ${rating.count} avis` : "Pas encore d'avis"}</span>
            </span>
          </span>
        }
      >
        <Link href={`/reservation?beachId=${beach.id}`} className={ui.btnPrimary}>
          <CalendarDays size={17} /> Voir les disponibilités
        </Link>
      </PageHero>

      <PageBody>
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Reveal className={`${ui.card} p-3 md:p-4`}>
              {beach.images.length > 0 ? (
                <>
                  <div className="relative h-72 md:h-[26rem] rounded-card overflow-hidden bg-sand">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={beach.images[activeImage]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image src={beach.images[activeImage]} alt={beach.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 58vw" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {beach.images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto scroll-thin pb-1">
                      {beach.images.map((img, i) => (
                        <button
                          key={img}
                          onClick={() => setActiveImage(i)}
                          aria-label={`Photo ${i + 1}`}
                          className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                            i === activeImage ? "border-coral scale-[1.03]" : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <IllustrationBlock Illustration={BeachDefault} className="h-72 md:h-[26rem] rounded-card" />
              )}
            </Reveal>

            <Reveal delay={0.08} className={`${ui.card} p-6 md:p-8`}>
              <span className={ui.eyebrow}>L&rsquo;emplacement</span>
              <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight mt-3">À propos du site.</h2>
              <p className="mt-4 text-ink/70 leading-relaxed whitespace-pre-line">{beach.description}</p>
              {beach.amenities.length > 0 && (
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {beach.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-3 rounded-2xl bg-sandlight px-4 py-3 text-sm font-semibold text-ink/80">
                      <span className="w-6 h-6 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Reveal delay={0.1} className={`${ui.card} p-6 md:p-7`}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className={ui.eyebrow}>Avis des joueurs</span>
                  <p className="mt-2 font-display text-4xl font-black text-ink">
                    {rating.count > 0 ? rating.average.toLocaleString("fr-FR") : "—"}
                    <span className="text-lg text-ink/40"> / 5</span>
                  </p>
                </div>
                <div className="text-right">
                  <Stars rating={rating.average} size={16} />
                  <p className="text-xs text-ink/50 mt-1">{rating.count} avis</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 max-h-[24rem] overflow-y-auto scroll-thin pr-1">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl bg-sandlight p-6 text-center text-sm text-ink/60">
                    <MessageSquare size={22} className="mx-auto mb-2 text-coral" />
                    Aucun avis pour le moment. Soyez le premier !
                  </div>
                ) : (
                  reviews.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 8) * 0.05 }}
                      className="rounded-2xl bg-sandlight p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-ink text-sun font-display font-black flex items-center justify-center">
                            {r.playerName.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-bold text-ink text-sm">{r.playerName}</p>
                            <p className="text-[11px] text-ink/45">
                              {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <Stars rating={r.rating} size={12} />
                      </div>
                      {r.comment && <p className="mt-3 text-sm text-ink/70 leading-relaxed">{r.comment}</p>}
                    </motion.div>
                  ))
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="relative overflow-hidden bg-ink text-white rounded-card p-6 md:p-7">
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/15 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Votre expérience</p>
                <h3 className="font-display text-2xl font-black mt-2 mb-5">Laisser un avis</h3>
                <ReviewForm beachId={beach.id} onSubmitted={load} />
              </div>
            </Reveal>

            <Link href="/plages" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-coral transition-colors">
              <ChevronLeft size={15} /> Toutes les plages
            </Link>
          </div>
        </div>
      </PageBody>
    </div>
  );
}
