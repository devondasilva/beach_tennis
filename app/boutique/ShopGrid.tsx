"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatFCFA } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import OrderForm from "./OrderForm";

export default function ShopGrid({ products }: { products: Product[] }) {
  const categories = useMemo(() => ["Tout", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const [cat, setCat] = useState("Tout");
  const shown = cat === "Tout" ? products : products.filter((p) => p.category === cat);

  return (
    <div>
      <div className="flex flex-wrap gap-2 bg-white border border-line rounded-2xl p-2 w-fit shadow-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`relative px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
              cat === c ? "text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {cat === c && (
              <motion.span layoutId="shop-cat" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.article
              layout
              key={p.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.04 }}
              className="group flex flex-col bg-white border border-line rounded-card overflow-hidden shadow-sm hover:shadow-xl hover:shadow-coral/10 transition-shadow duration-300"
            >
              <div className="relative w-full aspect-[4/3] bg-sandlight overflow-hidden">
                {p.images && p.images.length > 0 ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 court-lines-dark flex items-center justify-center text-ink/20">
                    <ShoppingBag size={44} className="group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500" />
                  </div>
                )}
                <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur text-ink px-3 py-1.5 rounded-full">
                  {p.category}
                </span>
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    p.stock === 0 ? "bg-coral text-white" : p.stock <= 5 ? "bg-sun text-ink" : "bg-ink/70 text-white backdrop-blur"
                  }`}
                >
                  {p.stock === 0 ? "Épuisé" : p.stock <= 5 ? `Plus que ${p.stock}` : "En stock"}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-xl font-black tracking-tight text-ink">{p.name}</h3>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed flex-1">{p.description}</p>
                <p className="mt-4 font-display text-2xl font-black text-coral">{formatFCFA(p.price)}</p>
                <OrderForm product={p} />
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
