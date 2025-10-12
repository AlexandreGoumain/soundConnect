# SoundConnect Frontend (React + Vite)

Interface utilisateur pour la plateforme de réservation de studios SoundConnect.

## Prérequis

-   Node.js LTS (18+ recommandé)
-   API backend SoundConnect en local (par défaut sur `http://localhost:5000`)

## Installation

```bash
cd frontend
npm install
```

## Configuration

Les appels réseau passent par `src/lib/apiClient.js` (Axios avec `withCredentials: true`).

-   Développement: `frontend/.env`
    -   `VITE_API_URL='http://localhost:5000/api'`
-   Production (build statique): `frontend/.env.production`
    -   `VITE_API_URL=/api`

Notes:

-   En dev, Vite proxy redirige `/api` → `http://localhost:5000` (voir `vite.config.js`).
-   En prod, servez le build derrière un reverse‑proxy qui route `/api` vers le backend, et idéalement `/uploads` vers les fichiers statiques du backend.
-   Le backend doit autoriser l’origine du frontend via `FRONTEND_URL` (voir backend/README.md) pour les cookies.

## Démarrage

```bash
# Lancer le serveur de dev
npm run dev

# Lancer le backend en parallèle (dans un autre terminal)
# (par défaut sur http://localhost:5000)
```

Par défaut, l’app est disponible sur `http://localhost:5173`.

## Intégration Backend

-   Cookies httpOnly (JWT) activés: Axios est configuré avec `withCredentials: true`.
-   CSRF: le client récupère et attache automatiquement le token via `GET /api/csrf-token` (intercepteur Axios dans `apiClient`). Aucune action manuelle nécessaire côté composants.
-   Proxy dev (vite): `vite.config.js` proxy `/api` → `http://localhost:5000`.
-   Images (uploads): le backend expose `/uploads/...`. En dev, ajoutez si besoin ce proxy pour afficher les images uploadées:

    ```js
    // vite.config.js
    export default defineConfig({
        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:5000",
                    changeOrigin: true,
                    secure: false,
                },
                "/uploads": {
                    target: "http://localhost:5000",
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    });
    ```

## Scripts

-   `npm run dev` — serveur de développement Vite
-   `npm run build` — build production (`dist/`)
-   `npm run preview` — prévisualisation locale du build
-   `npm run lint` — ESLint (voir `eslint.config.js`)

## Fonctionnalités principales

-   Parcours client: accueil, recherche de studios, détails d’un studio avec réservation, profil, changement de mot de passe, mes réservations (artiste).
-   Parcours studio: tableau de bord, création/édition de studios, gestion d’images (upload, suppression, ré‑ordonnancement, remplacement), réservations.
-   Avis & notes: liste/ajout/édition/suppression d’avis et statistiques côté studio.
-   Accessibilité/UX: toasts, navigation clavier, SCSS modulaire.

## Structure du projet

```
frontend/
├── public/                 # assets statiques
├── src/
│   ├── components/         # navbar, footer, toasts, UI partagée
│   ├── context/            # providers React (auth, toasts, filtres)
│   ├── features/           # vues par domaine (client, studio-dashboard)
│   ├── hooks/              # hooks personnalisés
│   ├── layouts/            # layouts client/studio
│   ├── lib/                # apiClient (Axios), utilitaires date/validation
│   ├── routes/             # routes React Router
│   └── styles/             # SCSS (variables, mixins, pages, composants)
├── index.html              # point d’entrée HTML
├── vite.config.js          # proxy dev, plugins React
└── package.json
```
