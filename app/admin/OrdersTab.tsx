"use client";

import { useState } from "react";
import { formatFCFA } from "@/lib/pricing";
import { AdminOrder } from "./types";

const STATUS_LABEL: Record<AdminOrder["status"], string> = {
  en_attente: "En attente",
  livree: "Livrée",
  annulee: "Annulée",
};

const STATUS_COLOR: Record<AdminOrder["status"], string> = {
  en_attente: "bg-sun/20 text-ink",
  livree: "bg-lagoon/10 text-lagoon",
  annulee: "bg-coral/10 text-coral",
};

export default function OrdersTab({
  orders,
  onChanged,
}: {
  orders: AdminOrder[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: AdminOrder["status"]) {
    setBusyId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (orders.length === 0) {
    return <p className="text-sm text-ink/60">Aucune commande pour le moment.</p>;
  }

  return (
    <div className="rounded-card border border-ink/15 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ink text-sandlight text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Joueur</th>
            <th className="px-4 py-3 font-semibold">Articles</th>
            <th className="px-4 py-3 font-semibold text-right">Total</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/40"}>
              <td className="px-4 py-3">{o.playerName}</td>
              <td className="px-4 py-3">
                {o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}
              </td>
              <td className="px-4 py-3 text-right font-semibold">{formatFCFA(o.total)}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[o.status]}`}
                >
                  {STATUS_LABEL[o.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {o.status !== "livree" && (
                    <button
                      disabled={busyId === o.id}
                      onClick={() => setStatus(o.id, "livree")}
                      className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                    >
                      Marquer livrée
                    </button>
                  )}
                  {o.status !== "annulee" && (
                    <button
                      disabled={busyId === o.id}
                      onClick={() => setStatus(o.id, "annulee")}
                      className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
