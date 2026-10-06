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
import hero from "@/public/img1.jpg";
import terrain from "@/public/img2.jpg";
import portrait from "@/public/img3.jpg";
import jeuLibre from "@/public/img4.jpg";
import coaching from "@/public/img5.jpg";
import evenements from "@/public/img6.jpg";
// import galerie1 from "@/public/images/accueil/galerie-1.jpg";
// import galerie2 from "@/public/images/accueil/galerie-2.jpg";
// import galerie3 from "@/public/images/accueil/galerie-3.jpg";
// import galerie4 from "@/public/images/accueil/galerie-4.jpg";

export const HOME_IMAGES = {
  hero: { src: hero, alt: "Séance de beach tennis sur une plage de Cotonou" },
  terrain: { src: terrain, alt: "Échange au filet pendant une séance encadrée" },
  portrait: { src: portrait, alt: "Joueur sur le sable lors d'un événement MADES" },
  activites: {
    jeuLibre: { src: jeuLibre, alt: "Jeu libre et forfaits" },
    coaching: { src: coaching, alt: "Coaching individuel" },
    evenements: { src: evenements, alt: "Événements" },
  },
  galerie: [
    { src: terrain, alt: "Séance encadrée sur le sable", label: "Séances" },
    { src: portrait, alt: "Événement sur la plage", label: "Événements" },
    { src: coaching, alt: "Coaching", label: "Coaching" },
    { src: evenements, alt: "Matériel", label: "Équipement" },
  ],
};
