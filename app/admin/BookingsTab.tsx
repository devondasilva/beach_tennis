"use client";

import { useState } from "react";
import { formatFCFA } from "@/lib/pricing";
import { AdminBooking } from "./types";

const STATUS_LABEL: Record<AdminBooking["status"], string> = {
  confirmee: "Confirmée",
  enregistree_sur_place: "Enregistrée sur place",
  annulee: "Annulée",
};

const STATUS_COLOR: Record<AdminBooking["status"], string> = {
  confirmee: "bg-lagoon/10 text-lagoon",
  enregistree_sur_place: "bg-sun/20 text-ink",
  annulee: "bg-coral/10 text-coral",
};

export default function BookingsTab({
  bookings,
  onChanged,
}: {
  bookings: AdminBooking[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: AdminBooking["status"]) {
    setBusyId(id);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onChanged();
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-ink/60">Aucune réservation pour le moment.</p>;
  }

  return (
    <div className="rounded-card border border-ink/15 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-ink text-sandlight text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Joueur</th>
            <th className="px-4 py-3 font-semibold">Plage</th>
            <th className="px-4 py-3 font-semibold">Formule</th>
            <th className="px-4 py-3 font-semibold">Créneau</th>
            <th className="px-4 py-3 font-semibold text-right">Montant</th>
            <th className="px-4 py-3 font-semibold">Statut</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className={i % 2 === 0 ? "bg-sandlight" : "bg-sand/40"}>
              <td className="px-4 py-3">{b.playerName}</td>
              <td className="px-4 py-3 text-ink/60">{b.beachName}</td>
              <td className="px-4 py-3">{b.tariffLabel}</td>
              <td className="px-4 py-3">
                {b.date} · {b.time}
              </td>
              <td className="px-4 py-3 text-right font-semibold">{formatFCFA(b.price)}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[b.status]}`}
                >
                  {STATUS_LABEL[b.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  {b.status !== "enregistree_sur_place" && b.status !== "annulee" && (
                    <button
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, "enregistree_sur_place")}
                      className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                    >
                      Enregistrer
                    </button>
                  )}
                  {b.status !== "annulee" && (
                    <button
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, "annulee")}
                      className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  )}
                  {b.status === "annulee" && (
                    <button
                      disabled={busyId === b.id}
                      onClick={() => setStatus(b.id, "confirmee")}
                      className="text-xs font-semibold text-ink/60 hover:underline disabled:opacity-50"
                    >
                      Réactiver
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
