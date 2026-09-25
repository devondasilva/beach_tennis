"use client";

import { useState } from "react";
import { AdminProduct } from "./types";

const emptyForm = { name: "", category: "", price: "", stock: "", description: "" };

export default function ShopTab({
  products,
  onChanged,
}: {
  products: AdminProduct[];
  onChanged: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { price: string; stock: string }>>({});

  function editValue(p: AdminProduct, field: "price" | "stock") {
    return edits[p.id]?.[field] ?? String(p[field]);
  }

  function setEdit(id: string, field: "price" | "stock", value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        price: prev[id]?.price ?? String(products.find((p) => p.id === id)?.price ?? ""),
        stock: prev[id]?.stock ?? String(products.find((p) => p.id === id)?.stock ?? ""),
        [field]: value,
      },
    }));
  }

  async function handleSave(id: string) {
    const edit = edits[id];
    if (!edit) return;
    setBusyId(id);
    try {
      await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: Number(edit.price), stock: Number(edit.stock) }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price) || 0,
          stock: Number(form.stock) || 0,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setForm(emptyForm);
      setShowForm(false);
      onChanged();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-ink/15 hover:border-coral hover:text-coral transition-colors"
        >
          {showForm ? "Annuler" : "+ Nouveau produit"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-card border border-ink/15 p-5 grid sm:grid-cols-2 gap-3"
        >
          <input
            required
            placeholder="Nom du produit"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <input
            required
            placeholder="Catégorie"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Prix (FCFA)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          <textarea
            placeholder="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-card border border-ink/20 px-3 py-2 text-sm sm:col-span-2"
          />
          {error && <p className="text-xs text-coral sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={creating}
            className="sm:col-span-2 rounded-card bg-coral text-white font-semibold py-2 text-sm hover:bg-ink transition-colors disabled:opacity-60"
          >
            {creating ? "Création…" : "Ajouter le produit"}
          </button>
        </form>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun produit dans le catalogue.</p>
      ) : (
        <div className="rounded-card border border-ink/15 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink text-sandlight text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Produit</th>
                <th className="px-4 py-3 font-semibold">Catégorie</th>
                <th className="px-4 py-3 font-semibold">Prix</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/40"}>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-ink/60">{p.category}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={editValue(p, "price")}
                      onChange={(e) => setEdit(p.id, "price", e.target.value)}
                      className="w-24 rounded-card border border-ink/20 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={editValue(p, "stock")}
                      onChange={(e) => setEdit(p.id, "stock", e.target.value)}
                      className="w-20 rounded-card border border-ink/20 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        disabled={busyId === p.id}
                        onClick={() => handleSave(p.id)}
                        className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                      <button
                        disabled={busyId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
