import { Import } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-sandlight/10 bg-ink text-sandlight">
      <div className="max-w-content mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image src="/logo.png" alt="Beach Tennis Bénin" width={50} height={50} />
          <p className="mt-3 text-sm text-sandlight/70 max-w-xs leading-relaxed">
            Un terrain, un coach, une communauté — le beach tennis s&rsquo;installe
            sur les plages de Cotonou, en partenariat avec des restaurants de
            bord de mer.
          </p>
        </div>
        <div>
          <p className="tag-label !text-sun mb-3">Activité</p>
          <p className="text-sm text-sandlight/75 leading-relaxed">
            Vendredi soir, samedi et dimanche.
            <br />
            Cours particuliers en semaine sur réservation.
          </p>
        </div>
        <div>
          <p className="tag-label !text-sun mb-3">Navigation</p>
          <ul className="space-y-2 text-sm text-sandlight/75">
            <li><Link href="/reservation" className="hover:text-sun">Réserver</Link></li>
            <li><Link href="/cours" className="hover:text-sun">Cours</Link></li>
            <li><Link href="/evenements" className="hover:text-sun">Événements</Link></li>
            <li><Link href="/boutique" className="hover:text-sun">Boutique</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sandlight/10 py-5">
        <p className="text-center text-xs text-sandlight/45 tracking-wide">
          Beach Tennis Bénin — plateforme de démonstration.
        </p>
      </div>
    </footer>
  );
}
