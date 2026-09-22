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
| `/admin` | Tableau de bord : chiffre d'affaires, réservations, cours, commandes, événements |

Toutes les pages consomment des routes API sous `app/api/*` (réservations,
cours, événements, produits, commandes, génération de QR code, statistiques).

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
- **Authentification admin** : la page `/admin` n'est pas protégée dans cette
  version de démonstration ; ajouter une vérification d'accès avant mise en
  production.
