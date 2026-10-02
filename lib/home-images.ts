/**
 * Images de la page d'accueil, importées statiquement pour next/image.
 *
 * Remplace les fichiers de /public/images/accueil/ par tes propres photos en
 * gardant les mêmes noms — ou change les lignes d'import ci-dessous pour
 * pointer vers d'autres fichiers (.jpg, .png, .webp). Next.js en déduit
 * automatiquement les dimensions et génère un flou de chargement.
 *
 * Attention : un fichier importé ici DOIT exister, sinon le build échoue.
 * Les fichiers fournis sont de simples images de remplacement (fond sable).
 */
import hero from "@/public/img3.jpg";
import jeuLibre from "@/public/img4.jpg";
import coaching from "@/public/img5.jpg";
import evenements from "@/public/img6.jpg";
// import galerie1 from "@/public/images/accueil/galerie-1.jpg";
// import galerie2 from "@/public/images/accueil/galerie-2.jpg";
// import galerie3 from "@/public/images/accueil/galerie-3.jpg";
// import galerie4 from "@/public/images/accueil/galerie-4.jpg";

export const HOME_IMAGES = {
  hero: { src: hero, alt: "Beach tennis sur les plages de Cotonou" },
  activites: {
    jeuLibre: { src: jeuLibre, alt: "Jeu libre et forfaits" },
    coaching: { src: coaching, alt: "Coaching individuel" },
    evenements: { src: evenements, alt: "Événements" },
  },
  galerie: [
    { src: hero, alt: "Fin de journée", label: "Fin de journée" },
    { src: evenements, alt: "Événements", label: "Événements" },
    { src: coaching, alt: "Coaching", label: "Coaching" },
    { src: jeuLibre, alt: "Équipement", label: "Équipement" },
  ],
};
