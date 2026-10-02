"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * Champ de saisie de mot de passe avec bouton pour basculer entre affichage
 * masqué (•••) et lisible en clair, réutilisé partout où un mot de passe
 * est saisi (connexion admin, changement de mot de passe…).
 */
const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { className = "", ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        className={`w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 pr-12 font-semibold text-ink placeholder:text-ink/35 focus:border-coral focus:outline-none transition-colors ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        tabIndex={-1}
        className="absolute right-1 top-0 h-full w-11 flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});

export default PasswordInput;
