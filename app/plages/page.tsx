import Link from "next/link";
import Image from "next/image";
import { getBeaches, getBeachRating } from "@/lib/db";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";
import BeachDefault from "@/components/illustrations/BeachDefault";

export const dynamic = "force-dynamic";

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-sun text-sm" aria-hidden>
      {"★".repeat(full)}
      <span className="text-ink/20">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default function PlagesPage() {
  const beaches = getBeaches()
    .filter((b) => b.active)
    .map((b) => ({ ...b, rating: getBeachRating(b.id) }));

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Nos plages</p>
        <h1 className="font-display text-4xl text-ink">Choisissez votre terrain</h1>
        <p className="mt-3 text-ink/70">
          Beach Tennis Bénin s&rsquo;installe chez plusieurs établissements
          partenaires en bord de mer. Découvrez chaque site, ses photos et les
          avis des joueurs avant de réserver.
        </p>
      </div>

      {beaches.length === 0 ? (
        <p className="mt-12 text-sm text-ink/60">Aucune plage disponible pour le moment.</p>
      ) : (
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {beaches.map((b) => (
            <Link
              key={b.id}
              href={`/plages/${b.id}`}
              className="block rounded-card border border-ink/15 overflow-hidden hover:border-lagoon transition-colors"
            >
              {b.images[0] ? (
                <div className="relative h-48 w-full">
                  <Image src={b.images[0]} alt={b.name} fill className="object-cover" />
                </div>
              ) : (
                <IllustrationBlock Illustration={BeachDefault} className="h-48" />
              )}
              <div className="p-6">
                <h2 className="font-display text-2xl text-ink">{b.name}</h2>
                <p className="mt-1 text-sm text-ink/60">{b.location}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Stars rating={b.rating.average} />
                  <span className="text-xs text-ink/50">
                    {b.rating.count > 0
                      ? `${b.rating.average}/5 · ${b.rating.count} avis`
                      : "Pas encore d'avis"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink/70 line-clamp-2">{b.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
