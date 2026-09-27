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
        className={`w-full rounded-card border border-ink/20 px-3 py-2 pr-11 bg-white ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        tabIndex={-1}
        className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});

export default PasswordInput;
