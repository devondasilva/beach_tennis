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
      <div className="mt-4 rounded-card bg-lagoon text-sandlight p-4 text-sm">
        <p className="font-semibold">Commande enregistrée — {formatFCFA(success.total)}</p>
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
        className="mt-4 w-full rounded-card border border-ink/20 text-ink font-semibold py-2 text-sm hover:border-coral hover:text-coral transition-colors disabled:opacity-50"
      >
        {product.stock === 0 ? "Rupture de stock" : "Commander"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
          className="flex-1 rounded-card border border-ink/20 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-16 rounded-card border border-ink/20 px-2 py-2 text-sm"
        />
      </div>
      <input
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone"
        className="w-full rounded-card border border-ink/20 px-3 py-2 text-sm"
      />
      {error && <p className="text-xs text-coral">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-card bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
        >
          {loading ? "…" : `Payer ${formatFCFA(product.price * qty)}`}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-card border border-ink/20 px-3 text-sm text-ink/70"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
