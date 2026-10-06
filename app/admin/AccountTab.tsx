"use client";

import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

export default function AccountTab({ adminName }: { adminName?: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-xs font-semibold text-ink/60 mb-1">Connecté en tant que</p>
        <p className="font-display text-xl text-ink">{adminName ?? "Administrateur"}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-ink/15 p-5 space-y-4">
        <p className="text-sm text-ink/60">
          Choisis un mot de passe d&apos;au moins 8 caractères. Utilise l&apos;icône œil pour
          vérifier ta saisie avant de valider.
        </p>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1" htmlFor="currentPassword">
            Mot de passe actuel
          </label>
          <PasswordInput
            id="currentPassword"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1" htmlFor="newPassword">
            Nouveau mot de passe
          </label>
          <PasswordInput
            id="newPassword"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1" htmlFor="confirmPassword">
            Confirmer le nouveau mot de passe
          </label>
          <PasswordInput
            id="confirmPassword"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-sm text-coral bg-coral/10 rounded-xl px-4 py-3">{error}</p>
        )}
        {success && (
          <p className="text-sm text-palm bg-palm/10 rounded-xl px-4 py-3">
            Mot de passe mis à jour avec succès.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-coral text-white font-semibold py-2.5 text-sm hover:bg-ink transition-colors disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
