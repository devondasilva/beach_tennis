import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
// Polices de l'identité MADES, auto-hébergées (chargement immédiat, sans Google Fonts)
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/barlow-condensed/latin-900.css";
import "@fontsource/barlow-condensed/latin-800-italic.css";
import "@fontsource/barlow-condensed/latin-900-italic.css";
import "@fontsource/hanken-grotesk/latin-400.css";
import "@fontsource/hanken-grotesk/latin-500.css";
import "@fontsource/hanken-grotesk/latin-600.css";
import "@fontsource/hanken-grotesk/latin-700.css";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/dm-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beach Tennis Bénin · Un programme MADES — Réservation, cours & événements",
  description:
    "Réservez un créneau de beach tennis, un cours avec un coach, inscrivez-vous aux événements et suivez votre classement sur les plages de Cotonou.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-bg font-body text-ink antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
