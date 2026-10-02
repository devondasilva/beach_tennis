import Link from "next/link";
import { Compass } from "lucide-react";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Erreur 404"
        icon={<Compass size={15} />}
        title="Balle"
        accent="hors du terrain."
        subtitle="La page que vous cherchez n'existe pas ou a été déplacée."
        image={PAGE_IMAGES.plages}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/" className={ui.btnPrimary}>
            Retour à l&rsquo;accueil
          </Link>
          <Link href="/reservation" className={ui.btnGhostDark}>
            Réserver un terrain
          </Link>
        </div>
      </PageHero>
      <PageBody>
        <div />
      </PageBody>
    </div>
  );
}
