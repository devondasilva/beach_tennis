import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin, Waves } from "lucide-react";
import { getBeaches, getBeachRating } from "@/lib/db";
import IllustrationBlock from "@/components/illustrations/IllustrationBlock";
import BeachDefault from "@/components/illustrations/BeachDefault";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import Stars from "@/components/ui/Stars";
import { Reveal } from "@/components/motion/Reveal";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default function PlagesPage() {
  const beaches = getBeaches()
    .filter((b) => b.active)
    .map((b) => ({ ...b, rating: getBeachRating(b.id) }));

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Nos plages"
        icon={<Waves size={15} />}
        title="Choisissez votre"
        accent="terrain."
        subtitle="Beach Tennis Bénin s'installe chez plusieurs établissements partenaires en bord de mer. Découvrez chaque site, ses photos et les avis des joueurs avant de réserver."
        image={PAGE_IMAGES.plages}
        crumbs={[{ href: "/", label: "Accueil" }]}
      >
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold">
            <MapPin size={15} className="text-sun" /> {beaches.length} site{beaches.length > 1 ? "s" : ""} actif{beaches.length > 1 ? "s" : ""}
          </span>
          <Link href="/#partenaires" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sun text-ink text-xs font-bold uppercase tracking-[0.15em] hover:bg-coral hover:text-white transition-colors">
            Devenir plage partenaire
          </Link>
        </div>
      </PageHero>

      <PageBody>
        {beaches.length === 0 ? (
          <EmptyState icon={<Waves size={24} />} title="Aucune plage pour le moment">
            Les premiers sites partenaires seront bientôt en ligne.
          </EmptyState>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {beaches.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08} className="h-full">
                <article className={`group h-full flex flex-col overflow-hidden ${ui.cardHover}`}>
                  <Link href={`/plages/${b.id}`} className="relative block h-64 overflow-hidden">
                    {b.images[0] ? (
                      <Image
                        src={b.images[0]}
                        alt={b.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <IllustrationBlock Illustration={BeachDefault} className="h-64" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                    <div className="absolute left-6 bottom-5 right-6 flex items-end justify-between gap-3 text-white">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                        <MapPin size={15} className="text-sun" /> {b.location}
                      </span>
                      {b.images.length > 1 && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                          {b.images.length} photos
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 md:p-7 flex flex-col flex-1">
                    <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight text-ink">{b.name}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars rating={b.rating.average} />
                      <span className="text-xs font-semibold text-ink/50">
                        {b.rating.count > 0 ? `${b.rating.average}/5 · ${b.rating.count} avis` : "Pas encore d'avis"}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-ink/70 leading-relaxed line-clamp-3">{b.description}</p>
                    {b.amenities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {b.amenities.slice(0, 4).map((a) => (
                          <span key={a} className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-sandlight text-ink/70">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-6 flex flex-wrap gap-3">
                      <Link href={`/reservation?beachId=${b.id}`} className={`${ui.btnPrimary} !px-5 !py-3`}>
                        Réserver ici
                      </Link>
                      <Link href={`/plages/${b.id}`} className={`${ui.btnGhost} !px-5 !py-3 group/btn`}>
                        Voir la fiche <ChevronRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </PageBody>
    </div>
  );
}
