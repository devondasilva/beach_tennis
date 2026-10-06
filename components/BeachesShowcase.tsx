"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";
import Reveal from "@/components/RevealFC";
import ArrowButton from "@/components/ui/ArrowButton";

interface Beach {
  id: string;
  name: string;
  location: string;
  description?: string;
  images: string[];
  active: boolean;
}

/** Liste des plages façon « modules » de MADES Formation Continue. */
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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-content px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="tag-label">Nos plages</p>
            <h2 className="h-display mt-4 max-w-2xl text-5xl md:text-6xl">
              Choisissez votre terrain, <span className="text-orange">face à la mer.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <ArrowButton href="/plages" variant="outline">
              Toutes les plages
            </ArrowButton>
          </Reveal>
        </div>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {beaches.map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <Link
                href={`/plages/${b.id}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 overflow-hidden py-6 md:grid-cols-[4rem_auto_1fr_auto] md:gap-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-orange transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                <span className="relative hidden font-mono text-sm text-mutedfg transition-colors group-hover:text-white/70 md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-ink text-white transition-all duration-500 group-hover:rotate-[-6deg] md:h-24 md:w-32">
                  {b.images[0] ? (
                    <Image src={b.images[0]} alt="" fill sizes="128px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <Waves size={30} />
                  )}
                </span>
                <div className="relative min-w-0 md:grid md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:gap-8">
                  <div className="min-w-0">
                    <p className="h-display text-3xl transition-colors group-hover:text-white md:text-4xl lg:text-5xl">{b.name}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mutedfg transition-colors group-hover:text-white/75">
                      {b.location}
                    </p>
                  </div>
                  {b.description && (
                    <p className="mt-1 hidden text-sm leading-relaxed text-mutedfg transition-colors group-hover:text-white/85 md:mt-0 md:line-clamp-2">
                      {b.description}
                    </p>
                  )}
                </div>
                <span className="arrow-chip relative group-hover:!border-white group-hover:!bg-white group-hover:!text-orange">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
