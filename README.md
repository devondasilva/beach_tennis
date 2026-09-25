# Beach Tennis Bénin — plateforme digitale

Application web du projet **Beach Tennis Bénin** : réservation de créneaux,
cours particuliers avec coach, événements mensuels, boutique d'accessoires,
profil joueur avec QR code et points de fidélité, et back-office de pilotage.

Construite avec **Next.js 14 (App Router)**, **TypeScript** et **Tailwind CSS**.
Les données (joueurs, réservations, cours, commandes, événements) sont
stockées dans de simples fichiers JSON sous `/data`, ce qui permet de tester
l'application immédiatement, sans base de données à configurer. Cette couche
(`lib/db.ts`) est isolée : elle peut être remplacée par une vraie base
(PostgreSQL, Supabase, etc.) sans toucher au reste du code.

## Démarrer le projet

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

Pour un build de production :

```bash
npm run build
npm run start
```

## Fonctionnalités

| Page | Rôle |
|---|---|
| `/` | Page d'accueil, présentation de l'offre et des tarifs |
| `/reservation` | Réservation d'un créneau de jeu (formules solo, duo, famille, groupe) |
| `/cours` | Réservation d'un cours particulier ou en petit groupe avec un coach |
| `/evenements` | Liste des tournois mensuels et inscription en ligne |
| `/boutique` | Catalogue d'accessoires (raquettes, balles, tenues) et commande |
| `/profil` | Espace joueur : QR code personnel, points de fidélité, historique |
| `/classement` | Ladder des joueurs classés par points de fidélité |
| `/plages` | Liste des plages/sites partenaires, avec photos et avis |
| `/plages/[id]` | Fiche d'une plage : galerie, avis, formulaire d'avis, lien de réservation pré-rempli |
| `/login` | Connexion (espace joueur ou administration) |
| `/admin` | Tableau de bord protégé : actions sur réservations, cours, événements, boutique, commandes, joueurs |

Toutes les pages consomment des routes API sous `app/api/*` (réservations,
cours, événements, produits, commandes, génération de QR code, statistiques).

## Connexion et rôles

Le site distingue deux profils, chacun avec son propre espace via `/login` :

- **Visiteur / joueur** — identifié par son numéro de téléphone (comme avant), avec création automatique du profil à la première connexion. Une fois connecté, `/profil` charge directement son espace sans ressaisir le numéro.
- **Administrateur** — identifiant + mot de passe, accès au tableau de bord complet sur `/admin`.

Un compte administrateur est créé par défaut :

```
Identifiant : admin
Mot de passe : BeachTennis2026
```

**Changez ce mot de passe avant toute mise en ligne réelle** avec :

```bash
npm run create-admin -- <identifiant> <nouveau-mot-de-passe> "Nom affiché"
```

La commande crée un nouvel administrateur, ou met à jour le mot de passe si l'identifiant existe déjà. Il n'y a pas d'interface web pour créer des comptes admin (choix volontaire, pour éviter qu'un accès mal protégé ne permette d'en créer un).

Techniquement : les sessions sont des cookies signés (HMAC, Web Crypto — compatible avec le middleware Next.js qui protège `/admin`), et les mots de passe sont hachés avec sel (scrypt) dans `data/admins.json`. Définissez la variable d'environnement `AUTH_SECRET` (chaîne aléatoire longue) avant un déploiement réel — sans elle, une valeur par défaut de développement est utilisée, indiquée dans `lib/auth.ts`.

## Tableau de bord admin (`/admin`)

Le tableau de bord n'est pas qu'un écran de statistiques : chaque onglet permet d'agir directement sur les données, sans passer par les fichiers JSON.

| Onglet | Actions possibles |
|---|---|
| Vue d'ensemble | Chiffre d'affaires et volumes par canal |
| Réservations | Enregistrer un joueur arrivé sur place, annuler / réactiver une réservation |
| Cours | Annuler / réactiver un cours |
| Événements | Créer un événement, le supprimer, retirer un inscrit |
| Plages | Créer un site (avec upload de photos), en ajouter/retirer, masquer ou supprimer, modérer les avis |
| Boutique | Ajouter un produit, modifier prix/stock, supprimer un produit |
| Commandes | Marquer une commande comme livrée ou annulée |
| Joueurs | Changer le niveau d'un joueur, ajuster ses points de fidélité (+/-10) |

Toutes ces actions passent par des routes API protégées côté serveur (`requireAdmin()`), pas seulement cachées dans l'interface : un appel direct à l'API sans session admin valide est rejeté (401), même si quelqu'un devine l'URL.

## Plages et avis

Le site gère désormais plusieurs sites de jeu (« plages » ou « espaces ») :

- **Côté visiteur** : `/plages` liste tous les sites actifs, avec photo, description, équipements et note moyenne. Chaque fiche (`/plages/[id]`) affiche la galerie complète, les avis des joueurs, et un formulaire pour en laisser un (nom, téléphone, note de 1 à 5, commentaire — identifié comme pour une réservation). Un bouton "Réserver sur ce site" renvoie vers `/reservation?beachId=...`, qui pré-sélectionne automatiquement la plage.
- **Côté réservation** (`/reservation`) : la plage est maintenant un champ obligatoire, au même titre que la formule et le créneau. Chaque réservation garde la trace de la plage choisie (visible dans le profil joueur et dans le tableau de bord admin).
- **Côté admin** (`/admin` → onglet **Plages**) : création d'une nouvelle plage avec upload de vraies photos (JPEG/PNG/WEBP, 8 Mo max par image — enregistrées dans `public/uploads/beaches/`), ajout ou retrait de photos sur une plage existante, masquage temporaire (sans la supprimer) ou suppression définitive, et modération des avis (suppression d'un avis inapproprié).

Une plage sans photo affiche une illustration par défaut (même système vectoriel que le reste du site) plutôt qu'un espace vide.

## Identifiant joueur

Il n'y a pas de système de mot de passe : un joueur est identifié par son
numéro de téléphone (celui utilisé pour le Mobile Money). La première
réservation, commande ou inscription à un événement crée automatiquement son
profil. Il peut ensuite le retrouver sur `/profil` en resaisissant son
numéro, ou via le lien direct reçu après une réservation
(`/profil?playerId=...`).

## Points de fidélité

1 point est crédité pour chaque tranche de 100 FCFA dépensée (réservations,
cours, boutique, inscriptions aux événements). Le seuil de 200 points pour
une séance offerte est indicatif et peut être ajusté dans
`app/profil/ProfilClient.tsx`.

## Tarifs

La grille tarifaire (séances, forfaits, cours) est centralisée dans
`lib/pricing.ts`, avec les mêmes montants que le business plan (tarif de
base à 1000 FCFA / 30 min). Modifier ce fichier suffit à répercuter un
changement de prix sur l'ensemble du site.

## Aller plus loin

- **Base de données réelle** : remplacer les fonctions de `lib/db.ts` par des
  requêtes vers PostgreSQL/Supabase/MySQL, en conservant les mêmes signatures.
- **Paiement Mobile Money réel** : les boutons MTN MoMo / Moov Money sont
  actuellement déclaratifs (choix du mode de paiement) ; il reste à brancher
  une API de paiement (Kkiapay, FedaPay, ou l'API directe des opérateurs).
- **Notifications SMS/WhatsApp** : brancher un fournisseur (Twilio, etc.)
  lors de la création d'une réservation dans `lib/db.ts`.
- **Renforcer la sécurité avant mise en ligne réelle** : changer le mot de
  passe admin par défaut (`npm run create-admin`), définir la variable
  d'environnement `AUTH_SECRET`, et passer les cookies de session en
  `secure` (déjà automatique dès que `NODE_ENV=production`).
- **Comptes joueurs plus robustes** : l'espace joueur n'utilise qu'un numéro
  de téléphone comme identifiant, sans mot de passe — cohérent avec l'usage
  prévu (peu de friction sur la plage), mais à faire évoluer avec un code
  SMS à usage unique si le site prend de l'ampleur.
#   b e a c h t e n n i s v 2  
 