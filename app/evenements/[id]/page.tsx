import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";
import EventRegisterForm from "./EventRegisterForm";

export const dynamic = "force-dynamic";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);
  if (!event) notFound();

  const placesLeft = event.capacity - event.registrations.length;

  return (
    <div className="max-w-content mx-auto px-6 py-16 grid md:grid-cols-12 gap-12">
      <div className="md:col-span-7">
        <p className="tag-label mb-3">{event.category}</p>
        <h1 className="font-display text-4xl text-ink">{event.title}</h1>
        <p className="mt-3 text-ink/70">
          {new Date(event.date + "T00:00:00").toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="mt-6 text-ink/80 leading-relaxed max-w-lg">{event.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
          <div className="rounded-card bg-sand p-4">
            <p className="text-xs text-ink/60">Inscription</p>
            <p className="font-display text-xl text-ink">{formatFCFA(event.entryFee)}</p>
          </div>
          <div className="rounded-card bg-sand p-4">
            <p className="text-xs text-ink/60">Places restantes</p>
            <p className="font-display text-xl text-ink">
              {placesLeft > 0 ? placesLeft : "Complet"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs text-ink/60 mb-1">Dotation</p>
          <p className="text-ink/80">{event.prize}</p>
        </div>
      </div>

      <div className="md:col-span-5">
        <div className="rounded-card border border-ink/15 p-6">
          <h2 className="font-display text-xl text-ink mb-4">S&rsquo;inscrire</h2>
          {placesLeft > 0 ? (
            <EventRegisterForm eventId={event.id} />
          ) : (
            <p className="text-sm text-ink/70">
              Cet événement est complet. Retrouvez le prochain tournoi sur la
              page événements.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
