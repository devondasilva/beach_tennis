import Image from "next/image";
import { Newspaper, ExternalLink } from "lucide-react";
import { getArticles } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ActualitesPage() {
  const articles = getArticles();

  return (
    <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Actualités</p>
        <h1 className="font-display text-4xl text-ink">Le club en mouvement</h1>
        <p className="mt-3 text-ink/70">
          Les dernières nouvelles de Beach Tennis Bénin et ce que la presse en dit.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/60">Aucune actualité pour le moment.</p>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => {
            const clickable = !!a.sourceUrl;
            const Wrapper = clickable ? "a" : "div";
            const wrapperProps = clickable
              ? { href: a.sourceUrl!, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <article
                key={a.id}
                className="rounded-card border border-ink/15 overflow-hidden flex flex-col"
              >
                <Wrapper
                  {...wrapperProps}
                  className={`flex flex-col flex-1 ${clickable ? "hover:opacity-90 transition-opacity" : ""}`}
                >
                  <div className="relative w-full aspect-[16/10] bg-sandlight">
                    {a.imageUrl ? (
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-ink/25">
                        <Newspaper size={32} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-ink/80 text-sandlight px-2.5 py-1 rounded-full">
                      {a.category === "revue_presse" ? "Revue de presse" : "Actualité"}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-ink/50 mb-1">
                      {new Date(a.publishedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {a.sourceName ? ` · ${a.sourceName}` : ""}
                    </p>
                    <h2 className="font-display text-lg text-ink">{a.title}</h2>
                    <p className="mt-2 text-sm text-ink/70 flex-1">{a.excerpt}</p>
                    {a.category === "actualite" && a.content && (
                      <p className="mt-4 text-sm text-ink/70 whitespace-pre-line">{a.content}</p>
                    )}
                    {clickable && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral">
                        Lire l&apos;article <ExternalLink size={13} />
                      </span>
                    )}
                  </div>
                </Wrapper>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
