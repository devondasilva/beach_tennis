"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/plages", label: "Plages" },
  { href: "/reservation", label: "Réserver" },
  { href: "/cours", label: "Cours" },
  { href: "/evenements", label: "Événements" },
  { href: "/boutique", label: "Boutique" },
  { href: "/classement", label: "Classement" },
];

export default function Navbar() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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
                key={l.href}
                href={l.href}
                label={l.label}
                isActive={pathname === l.href}
                onClick={closeMenu}
                mobile
              />
            ))}
          </nav>
          <Link
            href="/profil"
            className="hidden md:inline-flex items-center rounded-card border border-sandlight/30 text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:border-sun hover:text-sun transition-colors"
          >
            Mon profil
          </Link>
        </div>
        <nav className="flex md:hidden gap-5 overflow-x-auto pb-3 text-xs font-semibold tracking-widest uppercase">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-sandlight/75 hover:text-sun"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/profil" className="whitespace-nowrap text-sun">
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}

