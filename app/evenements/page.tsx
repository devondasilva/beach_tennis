import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, Trophy, Users } from "lucide-react";
import { getEvents } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";
import type { EventItem } from "@/lib/types";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import AdBanner from "@/components/AdBanner";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const MONTHS = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];

function DateBadge({ date, dark = false }: { date: string; dark?: boolean }) {
  const d = new Date(date + "T00:00:00");
  return (
    <div
      className={`w-16 shrink-0 rounded-2xl text-center py-2 shadow-lg ${
        dark ? "bg-ink text-white" : "bg-white text-ink"
      }`}
    >
      <p className="font-display text-2xl font-black leading-none">{d.getDate()}</p>
      <p className={`text-[10px] font-bold tracking-widest mt-1 ${dark ? "text-sun" : "text-coral"}`}>{MONTHS[d.getMonth()]}</p>
    </div>
  );
}

function EventCard({ e, past = false }: { e: EventItem; past?: boolean }) {
  const placesLeft = e.capacity - e.registrations.length;
  const fill = e.capacity ? Math.min(1, e.registrations.length / e.capacity) : 0;
  return (
    <Link
      href={`/evenements/${e.id}`}
      className={`group flex flex-col h-full ${ui.cardHover} overflow-hidden ${past ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="relative w-full aspect-[16/10] bg-ink overflow-hidden">
        {e.poster ? (
          <Image
            src={e.poster}
            alt={`Affiche de ${e.title}`}
            fill
            className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 court-lines flex items-center justify-center">
            <Trophy size={56} className="text-sun/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <DateBadge date={e.date} />
        </div>
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-ink/70 backdrop-blur text-white px-3 py-1.5 rounded-full">
          {past ? "Terminé" : placesLeft > 0 ? "Inscriptions ouvertes" : "Complet"}
        </span>
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <p className={ui.eyebrow}>{e.category}</p>
        <h3 className="font-display text-2xl font-black tracking-tight text-ink mt-2 group-hover:text-coral transition-colors">{e.title}</h3>
        <p className="mt-2 text-sm text-ink/60 capitalize">
          {new Date(e.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <p className="mt-3 text-sm text-ink/70 line-clamp-2">{e.description}</p>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <span className="text-ink/50 inline-flex items-center gap-1.5">
              <Users size={13} /> {e.registrations.length}/{e.capacity} inscrits
            </span>
            {!past && (
              <span className={placesLeft > 0 ? "text-lagoon" : "text-coral"}>
                {placesLeft > 0 ? `${placesLeft} places` : "Complet"}
              </span>
            )}
          </div>
          <div className="mt-2 h-2 rounded-full bg-ink/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-coral transition-all duration-700" style={{ width: `${fill * 100}%` }} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-display text-xl font-black text-ink">{formatFCFA(e.entryFee)}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral">
              {past ? "Voir" : "S'inscrire"} <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EvenementsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const all = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));
  const upcoming = all.filter((e) => e.date >= today);
  const past = all.filter((e) => e.date < today).reverse();
  const next = upcoming[0];

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Tournois & animations"
        icon={<Trophy size={15} />}
        title="Des rendez-vous"
        accent="sur le sable."
        subtitle="Inscription en ligne, catégories débutants et confirmés, ambiance de plage et des dotations pour les gagnants. Le classement vit toute l'année."
        image={PAGE_IMAGES.evenements}
        crumbs={[{ href: "/", label: "Accueil" }]}
        asideOnMobile
        aside={
          next ? (
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-7 rounded-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sun/20 flex items-center justify-center text-sun">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Prochain événement</p>
                    <p className="text-sm font-bold capitalize">
                      {new Date(next.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-5 font-display text-2xl font-black">{next.title}</p>
              <p className="mt-1 text-sm text-white/60">{next.category}</p>
              <Link href={`/evenements/${next.id}`} className={`mt-6 w-full ${ui.btnSun}`}>
                S&rsquo;inscrire <ChevronRight size={16} />
              </Link>
            </div>
          ) : undefined
        }
      />

      <PageBody>
        <AdBanner placement="evenements" className="mb-10" />

        {upcoming.length === 0 ? (
          <EmptyState icon={<Trophy size={24} />} title="Prochains tournois bientôt annoncés">
            Revenez très vite : les dates des prochains événements sont en préparation.
          </EmptyState>
        ) : (
          <div className={`grid gap-6 ${upcoming.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2"}`}>
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08} className="h-full">
                <EventCard e={e} />
              </Reveal>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <section className="mt-20">
            <Reveal className="mb-8">
              <span className={ui.eyebrow}>Archives</span>
              <h2 className={`${ui.sectionTitle} mt-3`}>Événements passés.</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 0.08} className="h-full">
                  <EventCard e={e} past />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </PageBody>
    </div>
  );
}
