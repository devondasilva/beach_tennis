"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminContactMessage } from "./types";

export default function ContactTab() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function toggleRead(m: AdminContactMessage) {
    setBusyId(m.id);
    try {
      await fetch(`/api/contact/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !m.read }),
      });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/contact/${id}`, { method: "DELETE" });
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60">
        Messages envoyés depuis le formulaire « Parlons de votre projet » sur la page
        d&apos;accueil.
        {unreadCount > 0 && (
          <span className="ml-2 font-semibold text-coral">
            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
          </span>
        )}
      </p>

      {messages.length === 0 ? (
        <p className="text-sm text-ink/60">Aucun message reçu pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-4 ${
                m.read ? "border-ink/10 bg-sandlight/60" : "border-coral/30 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {m.name}{" "}
                    {!m.read && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-coral align-middle ml-1">
                        Nouveau
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/60">
                    {m.phone} · {new Date(m.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    disabled={busyId === m.id}
                    onClick={() => toggleRead(m)}
                    className="text-xs font-semibold text-lagoon hover:underline disabled:opacity-50"
                  >
                    {m.read ? "Marquer non lu" : "Marquer lu"}
                  </button>
                  <button
                    disabled={busyId === m.id}
                    onClick={() => handleDelete(m.id)}
                    className="text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink/80 whitespace-pre-line">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
