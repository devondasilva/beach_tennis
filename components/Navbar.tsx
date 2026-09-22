"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/reservation", label: "Réserver" },
  { href: "/cours", label: "Cours" },
  { href: "/evenements", label: "Événements" },
  { href: "/boutique", label: "Boutique" },
  { href: "/classement", label: "Classement" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-40 bg-ink text-sandlight transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-display text-lg tracking-wide uppercase flex items-center"
          >
            <Image src="/logo.png" alt="Beach Tennis Bénin" width={50} height={50} />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-widest uppercase">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sandlight/75 hover:text-sun transition-colors"
              >
                {l.label}
              </Link>
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