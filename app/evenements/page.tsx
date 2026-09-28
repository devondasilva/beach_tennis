import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default function EvenementsPage() {
  const events = getEvents().sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Événements</p>
        <h1 className="font-display text-4xl text-ink">Nos événements</h1>
        <p className="mt-3 text-ink/70">
          Des rendez-vous sur le sable avec inscription en ligne et des prix pour les
          gagnants.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {events.map((e) => {
          const placesLeft = e.capacity - e.registrations.length;
          return (
            <div
              key={e.id}
              className="rounded-card border border-ink/15 overflow-hidden hover:border-coral/40 transition-colors"
            >
              {e.poster && (
                <div className="relative w-full aspect-[16/10] bg-sandlight">
                  <Image
                    src={e.poster}
                    alt={`Affiche de ${e.title}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-6">
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
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm">
                  <p className="text-ink/70">Inscription : {formatFCFA(e.entryFee)}</p>
                  <p
                    className={
                      placesLeft > 0 ? "text-lagoon font-semibold" : "text-coral font-semibold"
                    }
                  >
                    {placesLeft > 0 ? `${placesLeft} places restantes` : "Complet"}
                  </p>
                </div>
                <Link
                  href={`/evenements/${e.id}`}
                  className="shrink-0 text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full bg-ink text-white hover:bg-coral transition-colors"
                >
                  S&rsquo;inscrire
                </Link>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
