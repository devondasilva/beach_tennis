import Image from "next/image";
import { ExternalLink, Newspaper } from "lucide-react";
import { getArticles } from "@/lib/db";
import type { Article } from "@/lib/types";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function ArticleCard({ a, large = false }: { a: Article; large?: boolean }) {
  const clickable = !!a.sourceUrl;
  const Wrapper = clickable ? "a" : "div";
  const wrapperProps = clickable ? { href: a.sourceUrl!, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <article className={`group h-full overflow-hidden ${clickable ? ui.cardHover : ui.card}`}>
      <Wrapper {...wrapperProps} className={`flex h-full ${large ? "flex-col md:flex-row" : "flex-col"}`}>
        <div className={`relative bg-sandlight overflow-hidden ${large ? "w-full md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[22rem]" : "w-full aspect-[16/10]"}`}>
          {a.imageUrl ? (
            <Image
              src={a.imageUrl}
              alt={a.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
          ) : (
            <div className="absolute inset-0 court-lines flex items-center justify-center text-ink/20">
              <Newspaper size={40} />
            </div>
          )}
          <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-ink/80 backdrop-blur text-sandlight px-3 py-1.5 rounded-full">
            {a.category === "revue_presse" ? "Revue de presse" : "Actualité"}
          </span>
        </div>
        <div className={`flex flex-col flex-1 ${large ? "p-8 md:p-10 justify-center" : "p-6"}`}>
          <p className="text-xs font-semibold text-ink/50">
            {fmt(a.publishedAt)}
            {a.sourceName ? ` · ${a.sourceName}` : ""}
          </p>
          <h2 className={`font-display font-black tracking-tight text-ink mt-2 group-hover:text-coral transition-colors ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>
            {a.title}
          </h2>
          <p className="mt-3 text-sm text-ink/70 leading-relaxed flex-1">{a.excerpt}</p>
          {a.category === "actualite" && a.content && (
            <p className={`mt-4 text-sm text-ink/70 whitespace-pre-line ${large ? "" : "line-clamp-4"}`}>{a.content}</p>
          )}
          {clickable && (
            <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-coral">
              Lire l&apos;article <ExternalLink size={13} />
            </span>
          )}
        </div>
      </Wrapper>
    </article>
  );
}

export default function ActualitesPage() {
  const articles = getArticles();
  const [first, ...rest] = articles;

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Actualités & presse"
        icon={<Newspaper size={15} />}
        title="Le club"
        accent="en mouvement."
        subtitle="Les dernières nouvelles de Beach Tennis Bénin et ce que la presse en dit."
        image={PAGE_IMAGES.actualites}
        crumbs={[{ href: "/", label: "Accueil" }]}
      />
      <PageBody>
        {!first ? (
          <EmptyState icon={<Newspaper size={24} />} title="Aucune actualité pour le moment">
            Les premières nouvelles du club arrivent bientôt.
          </EmptyState>
        ) : (
          <>
            <Reveal>
              <ArticleCard a={first} large />
            </Reveal>
            {rest.length > 0 && (
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 3) * 0.08} className="h-full">
                    <ArticleCard a={a} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </PageBody>
    </div>
  );
}
