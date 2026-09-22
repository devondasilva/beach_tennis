import { getProducts } from "@/lib/db";
import { formatFCFA } from "@/lib/pricing";
import OrderForm from "./OrderForm";

export const dynamic = "force-dynamic";

export default function BoutiquePage() {
  const products = getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-xl">
        <p className="tag-label mb-3">Boutique</p>
        <h1 className="font-display text-4xl text-ink">
          Le matériel, sans repartir en ville
        </h1>
        <p className="mt-3 text-ink/70">
          Raquettes, balles et tenues à commander en ligne, retrait directement
          sur la plage au stand du coach.
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mt-12">
          <h2 className="font-display text-xl text-ink border-b border-ink/10 pb-2">
            {cat}
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category === cat)
              .map((p) => (
                <div key={p.id} className="rounded-card border border-ink/15 p-5">
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="mt-1 text-sm text-ink/60 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-lg text-coral">
                      {formatFCFA(p.price)}
                    </span>
                    <span className="text-xs text-ink/50">
                      {p.stock > 0 ? `${p.stock} en stock` : "Épuisé"}
                    </span>
                  </div>
                  <OrderForm product={p} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
