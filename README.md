# Rappa

<p align="center">
  <img src="./assets/rappa_intro.gif" />
</p>

Ce projet est développé entièrement en TypeScript. Le projet est complètement typé.<br>
Le package manager Bun est utilisé.

## Structure du monorepo

Le Monorepo est géré par Turborepo pour profiter des fonctionnalités de cache.

- **apps/frontend**
  Frontend de l'application
- **apps/backend**
  Backend de l'application
- **packages/eslint-config**
  Configuration commune d'ESLint
- **packages/prettier-config**
  Configuration commune de Prettier
- **packages/graphql-schema**
  Schema GraphQL de l'API et génération automatique des types

<p align="center">
  <img src="./assets/rappa_jump.gif" />
</p>

## Génération des types GraphQL

Le schema est défini dans le fichier `schema.ts` du code source du package `@workshop-graphql-rappa/graphql-schema`.
Lorsque la commande `dev` est active:

- Les types serveurs sont générés dans `resolver-types.ts`.
- Les types clients sont générs dans le dossier `client/`.

Cette génération est automatique lorsque le schema est modifié.

## Backend

Le backend utilise les technologies suivantes:

- **Apollo Server**
  Implémentation de la couche GraphQL la plus réputé et stable
- **Express**
  Serveur qui gére les requêtes HTTP et WS et qui sont délégués à Apollo Server
- **Prisma**
  ORM très complet avec un support parfait de TypeScript

## Frontend

Le frontend utilise les technologies suivantes:

- **React**
  Librairie Frontend pour construire l'interface
- **Vite**
  Vite est un tooling spécialisé dans le frontend et performance
- **TailwindCSS**
  Framework CSS qui permet de développer le style de l'application dans les balises HTML
- **Apollo Client**
  Client GraphQL qui gère les requêtes vers le Backend.

## Application

Avant de démarrer l'application, il faut s'assurer de plusieurs facteurs:

- **Bun** est obligatoire avec une version minimum: 1.2.2.
  Il est possible d'utiliser le fichier compose.yml pour lancer une image avec Bun.
- La base de données doit être à jour, pour faire une mise à jour, exécuter la commande `bun migrate`.
- S'assurer de la pertinence des fichiers `.env` dans apps/frontend et apps/backend.
  Il est possible de configurer des ports différents si besoin.
- Il peut être pratique de lancer `bun seed` pour créer deux comptes de base dans la base de données:
  - **Utilisateur administrateur:**<br>
    _Email_: admin@rappa.fr<br>
    _Password_: rappa-admin
  - **Utilisateur simple:**<br>
    _Email_: default@rappa.fr<br>
    _Password_: rappa

**Note:** Pour les utilisateurs de **Nix**, il y aussi un shell disponible avec `nix develop` qui contient tous les outils nécessaires.

<p align="center">
  <img src="./assets/rappa_flow.gif" />
</p>

#### Commandes disponibles:

- `bun build` Construit les fichiers de production pour le backend et le frontend
- `bun dev` Lance l'application en mode développement
- `bun lint` Vérifie les erreurs de base du code
- `bun format` Formatter le code en fonction de la configuration de Prettier
- `bun graphql-codegen` Lance une génération de types GraphQL
- `bun seed` Exécute le seeding de la base de données
- `bun migrate` Lance les migrations dans la base de données

#### Mode développement

Après le lancement de l'application en mode développement, elle sera disponible (sauf si changé dans les fichiers `.env`) aux adresses suivants:

**Backend (Apollo Studio):** [http://127.0.0.1:4000](http://127.0.0.1:4000)<br>
**Frontend:** [http://127.0.0.1:5173](http://127.0.0.1:5173)

Il est possible de naviguer dans logs des 3 services lancés en mode développement avec les flèches du haut et du bas.

<p align="center">
  <img src="./assets/rappa_ult.gif" />
</p>
