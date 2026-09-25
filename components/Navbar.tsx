"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, UserCircle } from "lucide-react";

const links = [
  { href: "/plages", label: "Plages" },
  { href: "/reservation", label: "Réserver" },
  { href: "/cours", label: "Cours" },
  { href: "/evenements", label: "Événements" },
  { href: "/boutique", label: "Boutique" },
  { href: "/classement", label: "Classement" },
];

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  mobile?: boolean;
  onClick: () => void;
}

// Sorti du corps de Navbar : évite de recréer/remonter le composant
// (et donc de perdre le focus clavier) à chaque re-render.
function NavLink({ href, label, isActive, mobile = false, onClick }: NavLinkProps) {
  const baseClasses = "transition-colors duration-200 tracking-widest uppercase touch-manipulation";

  const desktopClasses = `text-sm font-medium hover:text-sun ${
    isActive ? "text-sun" : "text-sandlight/90"
  }`;

  // py-5 (au lieu de py-6) + min-h-[56px] : cible tactile confortable
  // sans gaspiller trop d'espace vertical sur petits écrans (iPhone SE etc.)
  const mobileClasses = `flex items-center justify-center min-h-[56px] py-4 text-center text-lg sm:text-xl font-bold w-full border-b border-sandlight/10 active:bg-ink/70 ${
    isActive ? "text-sun bg-ink/50" : "text-sandlight"
  }`;

  return (
    <Link
      href={href}
      className={mobile ? `${baseClasses} ${mobileClasses}` : `${baseClasses} ${desktopClasses}`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const scrollLockY = useRef(0);

  const headerBarRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // --- Expose la hauteur réelle de la barre (logo/liens/burger) en variable CSS ---
  // Le header est en `fixed`, donc chaque page doit compenser avec un padding-top
  // égal à cette hauteur. On la mesure dynamiquement (plutôt que de la deviner en
  // dur par breakpoint) pour rester juste sur toutes les tailles d'écran et si le
  // design de la barre évolue plus tard. Les pages n'ont alors qu'à utiliser
  // `padding-top: calc(var(--nav-height) + <espace souhaité>)`.
  useEffect(() => {
    const el = headerBarRef.current;
    if (!el) return;

    const setVar = () => {
      document.documentElement.style.setProperty("--nav-height", `${el.offsetHeight}px`);
    };

    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("orientationchange", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", setVar);
    };
  }, []);

  // --- GESTION DU SCROLL (masquer/afficher la navbar), avec throttle via rAF ---
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return; // ne jamais masquer pendant que le menu mobile est ouvert

      if (ticking.current) return;
      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setIsVisible(false); // scroll vers le bas -> on masque
        } else {
          setIsVisible(true); // scroll vers le haut -> on affiche
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // --- Fermeture auto lors du changement de page ---
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // --- Fermeture au clavier (Échap) + focus sur le premier lien à l'ouverture ---
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    mobileNavRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  // --- Blocage du scroll du body quand le menu mobile est ouvert ---
  // Sur iOS Safari, `overflow: hidden` seul ne suffit pas : le body
  // "rubber-band" quand même et le fond défile sous l'overlay.
  // On fige la page en position fixed (technique éprouvée sur iOS)
  // puis on restaure exactement la position de scroll à la fermeture.
  useEffect(() => {
    if (isOpen) {
      scrollLockY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollLockY.current);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Effet de verre dépoli */}
      <div ref={headerBarRef} className="bg-ink/70 backdrop-blur-md border-b border-sandlight/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 group z-50 shrink-0 touch-manipulation"
              onClick={closeMenu}
            >
              <Image
                src="/logo.png"
                alt="Beach Tennis Bénin Logo"
                width={45}
                height={45}
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-[45px] sm:h-[45px] group-hover:scale-105 transition-transform"
                priority
              />
              <span className="font-display font-bold text-base sm:text-lg leading-tight tracking-tight hidden sm:block text-sandlight">
                BEACH TENNIS
                <br />
                BENIN
              </span>
            </Link>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} label={l.label} isActive={pathname === l.href} onClick={closeMenu} />
              ))}
            </nav>

            {/* BOUTON PROFIL DESKTOP */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/profil"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:text-sun transition-colors text-sandlight/90"
              >
                <UserCircle size={20} />
                Mon Compte
              </Link>
            </div>

            {/* BOUTON HAMBURGER MOBILE — cible tactile 44x44 min (recommandation Apple/WCAG) */}
            <button
              ref={menuButtonRef}
              type="button"
              className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-md z-50 text-sandlight hover:bg-sandlight/10 active:bg-sandlight/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sun touch-manipulation"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          MENU MOBILE PLEIN ÉCRAN
          Fond translucide + flou : le banner reste visible en transparence.
          Cliquer n'importe où sur la zone translucide ferme le menu.
          ========================================== */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        onClick={closeMenu}
        className={`fixed inset-0 top-0 bg-ink/80 backdrop-blur-xl z-40 md:hidden flex flex-col transition-[transform,opacity] duration-300 ease-in-out overscroll-contain overflow-x-hidden ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
        style={{
          height: "100dvh",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 4.5rem)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Bouton fermer explicite, visible même si on scrolle le contenu du menu */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
          }}
          aria-label="Fermer le menu"
          className="absolute top-3 right-4 flex items-center justify-center w-11 h-11 rounded-full bg-sandlight/10 active:bg-sandlight/20 text-sandlight touch-manipulation"
          style={{ marginTop: "env(safe-area-inset-top, 0px)" }}
        >
          <X size={22} />
        </button>

        <div
          className="flex flex-col items-center justify-start w-full h-full overflow-y-auto overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          <nav ref={mobileNavRef} className="flex flex-col items-center w-full border-t border-sandlight/10">
            {links.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.label}
                isActive={pathname === l.href}
                onClick={closeMenu}
                mobile
              />
            ))}
          </nav>

          {/* Espace Profil dans le menu mobile */}
          <div className="mt-auto w-full px-6 pt-6 pb-4 border-t border-sandlight/10">
            <Link
              href="/profil"
              onClick={closeMenu}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-sandlight/10 active:bg-sandlight/20 py-4 min-h-[56px] text-lg font-semibold text-sandlight touch-manipulation"
            >
              <UserCircle size={24} />
              Mon Espace
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
