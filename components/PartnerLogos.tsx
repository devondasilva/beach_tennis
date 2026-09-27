"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
}

/** Bande "Ils nous font confiance" : ne rend rien tant qu'aucun partenaire n'est configuré. */
export default function PartnerLogos() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/partners")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPartners(d.partners ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="max-w-content mx-auto px-6 py-10">
      <p className="text-center text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-6">
        Ils nous font confiance
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {partners.map((p) => {
          const logo = (
            <div className="relative h-10 w-28 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
            </div>
          );
          return p.websiteUrl ? (
            <a key={p.id} href={p.websiteUrl} target="_blank" rel="noopener noreferrer">
              {logo}
            </a>
          ) : (
            <div key={p.id}>{logo}</div>
          );
        })}
      </div>
    </section>
  );
}
