import { MapPin, ShoppingBag, Smartphone, Truck } from "lucide-react";
import { getProducts } from "@/lib/db";
import AdBanner from "@/components/AdBanner";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { PAGE_IMAGES } from "@/lib/page-images";
import ShopGrid from "./ShopGrid";

export const dynamic = "force-dynamic";

export default function BoutiquePage() {
  const products = getProducts();

  return (
    <div className="bg-sandlight">
      <PageHero
        badge="Boutique du club"
        icon={<ShoppingBag size={15} />}
        title="Le matériel, sans"
        accent="repartir en ville."
        subtitle="Raquettes, balles et tenues à commander en ligne, retrait directement sur la plage au stand du coach."
        image={PAGE_IMAGES.boutique}
        crumbs={[{ href: "/", label: "Accueil" }]}
        aside={
          <div className="hidden lg:block bg-white/10 backdrop-blur-xl border border-white/15 p-7 rounded-[2.25rem] space-y-4">
            {[
              { icon: Smartphone, t: "Paiement Mobile Money" },
              { icon: MapPin, t: "Retrait au stand du coach, sur la plage" },
              { icon: Truck, t: "Préparé pour votre prochaine séance" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-4 text-sm text-white/85">
                <span className="w-10 h-10 rounded-xl bg-sun/20 text-sun flex items-center justify-center shrink-0">
                  <x.icon size={18} />
                </span>
                {x.t}
              </div>
            ))}
          </div>
        }
      />
      <PageBody>
        <AdBanner placement="boutique" className="mb-10" />
        {products.length === 0 ? (
          <EmptyState icon={<ShoppingBag size={24} />} title="La boutique ouvre bientôt" />
        ) : (
          <ShopGrid products={products} />
        )}
      </PageBody>
    </div>
  );
}
