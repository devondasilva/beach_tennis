"use client";

import { useState } from "react";
import Link from "next/link";
import { formatFCFA } from "@/lib/pricing";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function OrderForm({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ playerId: string; total: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, productId: product.id, qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSuccess({ playerId: data.player.id, total: data.order.total });
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-4 rounded-2xl bg-ink text-sandlight p-5 text-sm">
        <p className="font-bold text-sun">Commande enregistrée — {formatFCFA(success.total)}</p>
        <p className="mt-1 text-sandlight/85">À récupérer sur place, au stand du coach.</p>
        <Link
          href={`/profil?playerId=${success.playerId}`}
          className="mt-2 inline-block text-sun font-semibold hover:underline"
        >
          Voir mes commandes →
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        disabled={product.stock === 0}
        className="mt-5 w-full rounded-2xl bg-ink text-white font-bold uppercase tracking-widest py-3.5 text-xs hover:bg-coral transition-colors disabled:opacity-40 disabled:hover:bg-ink"
      >
        {product.stock === 0 ? "Rupture de stock" : "Commander"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <div className="flex gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
          className="flex-1 min-w-0 rounded-xl border-2 border-ink/10 bg-white px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/35 focus:border-coral focus:outline-none transition-colors"
        />
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          aria-label="Quantité"
          className="w-20 rounded-xl border-2 border-ink/10 bg-white px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/35 focus:border-coral focus:outline-none transition-colors"
        />
      </div>
      <input
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone"
        className="w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-ink/35 focus:border-coral focus:outline-none transition-colors"
      />
      {error && <p className="text-xs font-semibold text-coral bg-coral/10 rounded-xl px-3 py-2">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-coral text-white font-bold uppercase tracking-wider py-3 text-xs hover:bg-ink transition-colors disabled:opacity-60"
        >
          {loading ? "…" : `Payer ${formatFCFA(product.price * qty)}`}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl border-2 border-ink/10 px-4 text-xs font-bold uppercase tracking-wider text-ink/60 hover:border-ink/30"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
