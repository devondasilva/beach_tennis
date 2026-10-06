import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, Gift, Ticket, Trophy, Users } from "lucide-react";
import { getEventById } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";
import EventRegisterForm from "./EventRegisterForm";

export const dynamic = "force-dynamic";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);
  if (!event) notFound();

  const placesLeft = event.capacity - event.registrations.length;
  const fill = event.capacity ? Math.min(1, event.registrations.length / event.capacity) : 0;
  const isPast = event.date < new Date().toISOString().slice(0, 10);
  const longDate = new Date(event.date + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const facts = [
    { icon: CalendarDays, label: "Date", value: <span className="capitalize">{longDate}</span> },
    { icon: Ticket, label: "Inscription", value: formatFCFA(event.entryFee) },
    { icon: Users, label: "Places restantes", value: placesLeft > 0 ? `${placesLeft} / ${event.capacity}` : "Complet" },
    { icon: Gift, label: "Dotation", value: event.prize },
  ];

  return (
    <div className="bg-sandlight">
      <PageHero
        badge={event.category}
        icon={<Trophy size={15} />}
        title={event.title}
        subtitle={<span className="capitalize">{longDate}</span>}
        image={event.poster ?? PAGE_IMAGES.evenements}
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/evenements", label: "Événements" },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
            <Ticket size={15} className="text-sun" /> {formatFCFA(event.entryFee)}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
            <Users size={15} className="text-sun" /> {placesLeft > 0 ? `${placesLeft} places restantes` : "Complet"}
          </span>
        </div>
      </PageHero>

      <PageBody>
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Reveal className={`${ui.card} p-6 md:p-8`}>
              <div className="grid sm:grid-cols-2 gap-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-4 rounded-2xl bg-sandlight p-4">
                    <span className="w-11 h-11 shrink-0 rounded-xl bg-white text-coral flex items-center justify-center shadow-sm">
                      <f.icon size={19} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">{f.label}</p>
                      <p className="mt-0.5 font-semibold text-ink">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-ink/50">
                  <span>Remplissage</span>
                  <span>
                    {event.registrations.length}/{event.capacity}
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-ink/[0.06] overflow-hidden">
                  <div className="h-full rounded-full bg-coral" style={{ width: `${fill * 100}%` }} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className={`${ui.card} p-6 md:p-8`}>
              <span className={ui.eyebrow}>Le tournoi</span>
              <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight mt-3">À propos de l&rsquo;événement.</h2>
              <p className="mt-4 text-ink/70 leading-relaxed whitespace-pre-line">{event.description}</p>
            </Reveal>

            {event.poster && (
              <Reveal delay={0.12} className={`${ui.card} p-4`}>
                <Image
                  src={event.poster}
                  alt={`Affiche de ${event.title}`}
                  width={900}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="w-full h-auto rounded-card"
                />
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1} className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-height,4.5rem)+1.5rem)]">
            <div className="relative overflow-hidden bg-ink text-white rounded-card p-7 md:p-8 shadow-xl shadow-ink/15">
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sun/15 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sun">Inscription</p>
                <h2 className="font-display text-2xl font-black mt-2">S&rsquo;inscrire au tournoi</h2>
                <div className="mt-6">
                  {isPast ? (
                    <p className="text-sm text-white/70">Cet événement est terminé. Retrouvez les prochains tournois sur la page événements.</p>
                  ) : placesLeft > 0 ? (
                    <EventRegisterForm eventId={event.id} />
                  ) : (
                    <p className="text-sm text-white/70">Cet événement est complet. Retrouvez le prochain tournoi sur la page événements.</p>
                  )}
                </div>
              </div>
            </div>
            <Link href="/evenements" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink/60 hover:text-coral transition-colors">
              <ChevronLeft size={15} /> Tous les événements
            </Link>
          </Reveal>
        </div>
      </PageBody>
    </div>
  );
}
