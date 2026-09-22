import Link from "next/link";
import { getEvents } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default function EvenementsPage() {
  const events = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Événements</p>
        <h1 className="font-display text-4xl text-ink">Le tournoi du mois</h1>
        <p className="mt-3 text-ink/70">
          Chaque mois, un rendez-vous sur le sable avec inscription en ligne
          et des prix pour les gagnants.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {events.map((e) => {
          const placesLeft = e.capacity - e.registrations.length;
          return (
            <Link
              key={e.id}
              href={`/evenements/${e.id}`}
              className="block rounded-card border border-ink/15 p-6 hover:border-coral transition-colors"
            >
              <p className="tag-label">{e.category}</p>
              <h2 className="font-display text-2xl text-ink mt-2">{e.title}</h2>
              <p className="mt-2 text-sm text-ink/70">
                {new Date(e.date + "T00:00:00").toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <div className="rule my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/70">
                  Inscription : {formatFCFA(e.entryFee)}
                </span>
                <span
                  className={placesLeft > 0 ? "text-lagoon font-semibold" : "text-coral font-semibold"}
                >
                  {placesLeft > 0 ? `${placesLeft} places restantes` : "Complet"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
