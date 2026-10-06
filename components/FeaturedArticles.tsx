"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, ExternalLink } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: "actualite" | "revue_presse";
  sourceUrl: string | null;
  publishedAt: string;
}

/** Ne rend rien tant qu'aucun article n'a été mis en avant par l'admin. */
export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/articles?featured=1")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setArticles(d.articles ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="max-w-content mx-auto px-6 py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-coral">À la une</span>
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-3 text-ink">Actualités du club.</h2>
        </div>
        <Link
          href="/actualites"
          className="text-xs font-bold uppercase tracking-widest text-coral hover:underline whitespace-nowrap"
        >
          Toutes les actualités
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => {
          const href = a.sourceUrl || "/actualites";
          const external = !!a.sourceUrl;
          return (
            <Link
              key={a.id}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="bg-white rounded-card border border-line overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-coral/10 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative w-full aspect-[16/10] bg-sandlight overflow-hidden">
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-ink/25">
                    <Newspaper size={28} />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-ink/50 mb-1">
                  {new Date(a.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <h3 className="font-display text-lg font-bold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm text-ink/70 flex-1">{a.excerpt}</p>
                {external && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral">
                    Lire l&apos;article <ExternalLink size={13} />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
