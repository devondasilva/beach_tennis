"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

type Mode = "player" | "admin";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [mode, setMode] = useState<Mode>("player");

  // Espace joueur
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Administration
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlayerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/player-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      router.push(next && next.startsWith("/") ? next : "/profil");
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-content mx-auto px-6 pt-[calc(var(--nav-height,4.5rem)+1.5rem)] pb-16">
      <div className="max-w-md mx-auto">
        <p className="tag-label mb-3">Connexion</p>
        <h1 className="font-display text-4xl text-ink">
          {mode === "player" ? "Mon espace joueur" : "Administration"}
        </h1>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("player");
              setError(null);
            }}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
              mode === "player"
                ? "bg-ink text-white border-ink"
                : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            Espace joueur
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setError(null);
            }}
            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
              mode === "admin"
                ? "bg-ink text-white border-ink"
                : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            Administration
          </button>
        </div>

        {mode === "player" ? (
          <>
            <p className="mt-4 text-sm text-ink/60">
              Connecte-toi avec ton nom et ton numéro de téléphone pour accéder au
              classement et à ton espace personnel. Si c&rsquo;est ta première visite,
              un profil est créé automatiquement.
            </p>
            <form onSubmit={handlePlayerSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1" htmlFor="name">
                  Nom complet
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Aïcha Dossou"
                  className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1" htmlFor="phone">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex. 97 00 00 00"
                  className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
                />
              </div>
              {error && (
                <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-card bg-coral text-white font-semibold px-6 py-3 hover:bg-ink transition-colors disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm text-ink/60">
              Accès réservé à l&rsquo;équipe Beach Tennis Bénin.
            </p>
            <form onSubmit={handleAdminSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1" htmlFor="username">
                  Identifiant
                </label>
                <input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1" htmlFor="password">
                  Mot de passe
                </label>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-sm text-coral bg-coral/10 rounded-card px-4 py-3">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-card bg-ink text-white font-semibold px-6 py-3 hover:bg-coral transition-colors disabled:opacity-60"
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
