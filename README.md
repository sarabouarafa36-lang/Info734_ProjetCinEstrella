# CinEstrella

Projet de l'UE INFO734 (exercices serveur) : une application web sur le thème du cinéma, construite avec **React 19**, **TypeScript** et **Vite**.

Le projet réunit les exercices des TD 1 à 7. Un menu en haut de la page permet d'ouvrir chaque TD :

| TD | Contenu | Dossier |
|----|---------|---------|
| TD 1 | Fiche d'un film | `src/td1-fiche-film` |
| TD 2 | Cartes de films | `src/td2-cartes` |
| TD 3 | Compteur | `src/td3-compteur` |
| TD 4 | Bouton « J'aime » | `src/td4-jaime` |
| TD 5 | Recherche | `src/td5-recherche` |
| TD 6 | Minuteur | `src/td6-minuteur` |
| TD 7 | Grille d'affiches | `src/td7-affiches` |

## Lancer le projet

Prérequis : [Node.js](https://nodejs.org) et npm installés.

```bash
git clone https://github.com/sarabouarafa36-lang/Info734_ProjetCinEstrella.git
cd Info734_ProjetCinEstrella
npm ci
npm run dev
```

Puis ouvre http://localhost:5173 dans ton navigateur.

## Commandes utiles

- `npm ci` : installe exactement les dépendances listées dans `package-lock.json`.
- `npm run dev` : lance le site en mode développement.
- `npm run build` : vérifie les types, puis construit le site dans `dist/`.
- `npm run preview` : affiche le site construit.

## Structure du projet

- `src/` : le code React, un dossier par TD.
- `src/donnees/films.ts` : la liste des films.
- `public/films.json` : les films chargés par la grille du TD 7.
- `src/Menu.tsx` : le menu de navigation entre les TD.

## Workflow Git

Chaque TD se termine par un commit envoyé sur GitHub :

```bash
git add .
git commit -m "TDx : description"
git push
```

---
# Corrigé des TD React — lundi 19 octobre 2026

Une solution possible des TD 1 à 7. Tu peux la lire, la comparer à ton code, ou t'en servir comme projet de départ pour les TD suivants.

1. Dans ce dossier : `npm ci`, puis `npm run dev`.
2. Ouvre http://localhost:5173. Le menu en haut de la page ouvre le corrigé de chaque TD.

`npm run build` vérifie les types, puis construit le site.

Pour les TD 9 et 10 : les films sont dans `src/donnees/films.ts`. La grille du TD 7 (`src/td7-affiches/Td7.tsx`) les charge depuis `public/films.json`.
