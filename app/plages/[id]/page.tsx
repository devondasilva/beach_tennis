"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";
import BeachDefault from "@/components/illustrations/BeachDefault";
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

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-sun" aria-hidden>
      {"★".repeat(full)}
      <span className="text-ink/20">{"★".repeat(5 - full)}</span>
    </span>
  );
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
      setActiveImage(0);
    });
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (notFound) {
    return (
      <div className="max-w-content mx-auto px-6 py-16">
        <p className="text-ink/70">
          Cette plage est introuvable.{" "}
          <Link href="/plages" className="text-coral font-semibold hover:underline">
            Voir toutes les plages
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!beach) {
    return <div className="max-w-content mx-auto px-6 py-16">Chargement…</div>;
  }

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          {beach.images.length > 0 ? (
            <div>
              <div className="relative h-80 rounded-card overflow-hidden">
                <Image
                  src={beach.images[activeImage]}
                  alt={beach.name}
                  fill
                  className="object-cover"
                />
              </div>
              {beach.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {beach.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-16 shrink-0 rounded-card overflow-hidden border-2 ${
                        i === activeImage ? "border-coral" : "border-transparent"
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <IllustrationBlock Illustration={BeachDefault} className="h-80 rounded-card" />
          )}

          <p className="tag-label mt-8 mb-2">Emplacement</p>
          <h1 className="font-display text-4xl text-ink">{beach.name}</h1>
          <p className="mt-1 text-ink/60">{beach.location}</p>
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={rating.average} />
            <span className="text-sm text-ink/50">
              {rating.count > 0 ? `${rating.average}/5 · ${rating.count} avis` : "Pas encore d'avis"}
            </span>
          </div>
          <p className="mt-6 text-ink/70 leading-relaxed max-w-lg">{beach.description}</p>

          {beach.amenities.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {beach.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sand text-ink/70"
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/reservation?beachId=${beach.id}`}
            className="mt-8 inline-flex items-center rounded-card bg-coral text-white font-semibold px-6 py-3 hover:bg-ink transition-colors"
          >
            Réserver sur ce site
          </Link>
        </div>

        <div className="md:col-span-5">
          <h2 className="font-display text-xl text-ink mb-4">Avis des joueurs</h2>
          <div className="space-y-4 mb-8 max-h-[26rem] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <p className="text-sm text-ink/60">Aucun avis pour le moment. Soyez le premier !</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="rounded-card border border-ink/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink text-sm">{r.playerName}</p>
                    <Stars rating={r.rating} />
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-ink/70">{r.comment}</p>}
                </div>
              ))
            )}
          </div>

          <div className="rounded-card border border-ink/15 p-5">
            <h3 className="font-display text-lg text-ink mb-3">Laisser un avis</h3>
            <ReviewForm beachId={beach.id} onSubmitted={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
