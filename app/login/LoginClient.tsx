"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "player" | "admin";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [mode, setMode] = useState<Mode>(next === "/admin" ? "admin" : "player");

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
      router.push("/profil");
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
    <div className="max-w-content mx-auto px-6 py-16">
      <div className="max-w-md mx-auto">
        <p className="tag-label mb-3">Connexion</p>
        <h1 className="font-display text-4xl text-ink">Accéder à votre espace</h1>

        <div className="mt-8 grid grid-cols-2 rounded-card border border-ink/15 overflow-hidden text-sm font-bold uppercase tracking-widest">
          <button
            type="button"
            onClick={() => setMode("player")}
            className={`py-3 transition-colors ${
              mode === "player" ? "bg-ink text-white" : "bg-white text-ink/60 hover:text-ink"
            }`}
          >
            Espace joueur
          </button>
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`py-3 transition-colors ${
              mode === "admin" ? "bg-ink text-white" : "bg-white text-ink/60 hover:text-ink"
            }`}
          >
            Administration
          </button>
        </div>

        {mode === "player" ? (
          <form onSubmit={handlePlayerSubmit} className="mt-8 space-y-4">
            <p className="text-sm text-ink/60">
              Entrez votre nom et votre numéro de téléphone. Si c&rsquo;est votre
              première visite, votre profil est créé automatiquement.
            </p>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1" htmlFor="name">
                Nom complet
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Awa Djossou"
                className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1" htmlFor="phone">
                Téléphone
              </label>
              <input
                id="phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
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
              {loading ? "Connexion…" : "Accéder à mon profil"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="mt-8 space-y-4">
            <p className="text-sm text-ink/60">
              Accès réservé à l&rsquo;équipe Beach Tennis Bénin.
            </p>
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
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-card border border-ink/20 px-3 py-2 bg-white"
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
        )}
      </div>
    </div>
  );
}
