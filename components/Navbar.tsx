"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const links = [
  { href: "/plages", label: "Plages" },
  { href: "/reservation", label: "Réserver" },
  { href: "/cours", label: "Cours" },
  { href: "/evenements", label: "Événements" },
  { href: "/boutique", label: "Boutique" },
  { href: "/classement", label: "Classement" },
];

interface Session {
  role: "admin" | "player";
  id: string;
  name: string;
}

export default function Navbar() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setSession(d.session))
      .finally(() => setSessionLoaded(true));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.push("/");
    router.refresh();
  }

  const accountLink =
    sessionLoaded && session?.role === "admin" ? (
      <Link
        href="/admin"
        className="hidden md:inline-flex items-center rounded-card border border-sandlight/30 text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:border-sun hover:text-sun transition-colors"
      >
        Tableau de bord
      </Link>
    ) : sessionLoaded && session?.role === "player" ? (
      <Link
        href="/profil"
        className="hidden md:inline-flex items-center rounded-card border border-sandlight/30 text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:border-sun hover:text-sun transition-colors"
      >
        Mon profil
      </Link>
    ) : (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center rounded-card border border-sandlight/30 text-xs font-semibold tracking-widest uppercase px-4 py-2 hover:border-sun hover:text-sun transition-colors"
      >
        Connexion
      </Link>
    );

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
          <div className="hidden md:flex items-center gap-3">
            {accountLink}
            {sessionLoaded && session && (
              <button
                onClick={handleLogout}
                className="text-xs font-semibold tracking-widest uppercase text-sandlight/50 hover:text-coral transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
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
          {sessionLoaded && session?.role === "admin" && (
            <Link href="/admin" className="whitespace-nowrap text-sun">
              Dashboard
            </Link>
          )}
          {sessionLoaded && session?.role === "player" && (
            <Link href="/profil" className="whitespace-nowrap text-sun">
              Profil
            </Link>
          )}
          {sessionLoaded && !session && (
            <Link href="/login" className="whitespace-nowrap text-sun">
              Connexion
            </Link>
          )}
          {sessionLoaded && session && (
            <button onClick={handleLogout} className="whitespace-nowrap text-sandlight/50">
              Déconnexion
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
