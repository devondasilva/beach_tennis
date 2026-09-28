"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Waves } from "lucide-react";

interface Beach {
  id: string;
  name: string;
  location: string;
  images: string[];
  active: boolean;
}

export default function BeachesShowcase() {
  const [beaches, setBeaches] = useState<Beach[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/beaches")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setBeaches((d.beaches ?? []).filter((b: Beach) => b.active));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (beaches.length === 0) return null;

  return (
    <section className="max-w-content mx-auto px-6 py-16 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="tag-label mb-2">Voir nos plages</p>
          <h2 className="font-display text-3xl text-ink">Choisissez votre terrain</h2>
        </div>
        <Link
          href="/plages"
          className="text-xs font-bold uppercase tracking-widest text-coral hover:underline whitespace-nowrap"
        >
          Voir plus
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {beaches.slice(0, 3).map((b) => (
          <Link
            key={b.id}
            href={`/plages/${b.id}`}
            className="rounded-card border border-ink/15 overflow-hidden hover:border-lagoon transition-colors group"
          >
            {b.images[0] ? (
              <div className="relative h-40 w-full">
                <Image
                  src={b.images[0]}
                  alt={b.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="h-40 w-full bg-sand/60 flex items-center justify-center text-ink/25">
                <Waves size={32} />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-display text-lg text-ink">{b.name}</h3>
              <p className="mt-1 text-sm text-ink/60">{b.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
