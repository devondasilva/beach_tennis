"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, QrCode, Trophy, UserCircle, Waves } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import PageHero, { PageBody } from "@/components/ui/PageHero";
import { PAGE_IMAGES } from "@/lib/page-images";
import { ui } from "@/lib/ui";

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
    <div className="bg-sandlight">
      <PageHero
        badge="Connexion"
        icon={<UserCircle size={15} />}
        title={mode === "player" ? "Mon espace" : "Espace"}
        accent={mode === "player" ? "joueur." : "administration."}
        subtitle="Retrouvez votre QR code, vos points de fidélité, votre historique et le classement des joueurs."
        image={PAGE_IMAGES.compte}
        crumbs={[{ href: "/", label: "Accueil" }]}
        aside={
          <div className="hidden lg:block bg-white/10 backdrop-blur-xl border border-white/15 p-7 rounded-card space-y-4">
            {[
              { icon: QrCode, t: "Votre QR code d'accès personnel" },
              { icon: Trophy, t: "Vos points et votre place au classement" },
              { icon: Waves, t: "L'historique de vos séances et cours" },
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-4 text-sm text-white/85">
                <span className="w-10 h-10 rounded-xl bg-sun/20 text-sun flex items-center justify-center shrink-0">
                  <x.icon size={18} />
                </span>
                {x.t}
              </div>
            ))}
          </div>
        }
      />
      <PageBody>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-lg mx-auto ${ui.card} p-7 md:p-10`}
      >
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sandlight p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode("player");
              setError(null);
            }}
            className={`relative text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-colors ${
              mode === "player" ? "text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {mode === "player" && <motion.span layoutId="login-tab" className="absolute inset-0 rounded-xl bg-ink" />}
            <span className="relative">Espace joueur</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setError(null);
            }}
            className={`relative text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl transition-colors ${
              mode === "admin" ? "text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {mode === "admin" && <motion.span layoutId="login-tab" className="absolute inset-0 rounded-xl bg-ink" />}
            <span className="relative inline-flex items-center gap-1.5">
              <Lock size={12} /> Administration
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
        {mode === "player" ? (
          <motion.div key="player" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }}>
            <p className="mt-6 text-sm text-ink/60 leading-relaxed">
              Connecte-toi avec ton nom et ton numéro de téléphone pour accéder au
              classement et à ton espace personnel. Si c&rsquo;est ta première visite,
              un profil est créé automatiquement.
            </p>
            <form onSubmit={handlePlayerSubmit} className="mt-6 space-y-4">
              <div>
                <label className={ui.label} htmlFor="name">
                  Nom complet
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Aïcha Dossou"
                  className={ui.input}
                />
              </div>
              <div>
                <label className={ui.label} htmlFor="phone">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex. 97 00 00 00"
                  className={ui.input}
                />
              </div>
              {error && (
                <p className={ui.error}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${ui.btnPrimary}`}
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
            <p className="mt-6 text-sm text-ink/60 leading-relaxed">
              Accès réservé à l&rsquo;équipe Beach Tennis Bénin.
            </p>
            <form onSubmit={handleAdminSubmit} className="mt-6 space-y-4">
              <div>
                <label className={ui.label} htmlFor="username">
                  Identifiant
                </label>
                <input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={ui.input}
                />
              </div>
              <div>
                <label className={ui.label} htmlFor="password">
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
                <p className={ui.error}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${ui.btnDark}`}
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
      </PageBody>
    </div>
  );
}
