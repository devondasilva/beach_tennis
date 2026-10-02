"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, Waves } from "lucide-react";

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
    <section className="max-w-content mx-auto px-6 pt-16 md:pt-20 pb-6 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between gap-4 mb-10"
      >
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coral">Voir nos plages</span>
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-3 text-ink">
            Choisissez votre terrain.
          </h2>
        </div>
        <Link
          href="/plages"
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral whitespace-nowrap"
        >
          Voir plus <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {beaches.slice(0, 3).map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
          >
            <Link
              href={`/plages/${b.id}`}
              className="group block bg-white rounded-[2rem] border border-ink/[0.08] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-coral/10 hover:-translate-y-1 transition-all duration-300"
            >
              {b.images[0] ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={b.images[0]}
                    alt={b.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                </div>
              ) : (
                <div className="h-52 w-full bg-sand/60 flex items-center justify-center text-ink/25">
                  <Waves size={32} />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-xl font-black text-ink">{b.name}</h3>
                <p className="mt-1 text-sm text-ink/60 inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-coral" /> {b.location}
                </p>
                <span className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral">
                  Voir plus <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
