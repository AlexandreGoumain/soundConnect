# SoundConnect Backend

API Node.js/Express (MySQL) pour la plateforme de réservation de studios SoundConnect.

## Prérequis

-   MySQL en cours d'exécution et accessible
-   Node.js + npm installés

## Installation

```bash
cd backend
npm install
```

## Configuration

### Variables d'environnement (.env)

Créez un fichier `.env` à la racine du dossier `backend/` (vous pouvez prendre `backend/.env.example` comme base) :

```
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=soundconnect
DB_POOL_SIZE=10

# Serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

# CORS (URL exacte du frontend)
FRONTEND_URL=http://localhost:5173
```

Notes:

-   `DB_POOL_SIZE` est utilisé par le pool MySQL (mysql2). Choisissez une valeur adaptée à votre environnement (ex. 10).
-   `FRONTEND_URL` doit être l'origine exacte qui consommera l'API (CORS + cookies avec `credentials`).
-   En production (`NODE_ENV=production`), les cookies d'auth utilisent `secure` et `sameSite=none`.

### Base de données

Ce dépôt ne contient pas de migrations SQL. L'API attend au minimum les tables `users`, `roles`, `studios`, `reservations`, `reviews` avec les colonnes utilisées par les modèles/services. Assurez‑vous que la table `roles` contient les rôles attendus : `artist` et `studio`.

## Démarrage

```bash
# Développement (auto-reload)
npm run dev

# Production
npm start
```

Un script d'aide existe à la racine (`backend-start.sh`) pour installer uniquement les dépendances de production et démarrer l'API.

## Authentification & Sécurité

-   Authentification via cookie httpOnly `auth_token` (JWT). Configurez votre client HTTP pour envoyer/recevoir les cookies :
    -   fetch: `credentials: "include"`
    -   axios: `withCredentials: true`
-   CSRF activé pour toutes les requêtes mutantes (POST/PUT/PATCH/DELETE). Récupérez d'abord le token :
    -   `GET /api/csrf-token` → définit le cookie non httpOnly `XSRF-TOKEN` et renvoie `{ csrfToken }`
    -   Envoyez ensuite ce token dans l'en‑tête `X-CSRF-Token` (ou `X-XSRF-Token`) de vos requêtes mutantes, avec les cookies.

## Points d'entrée principaux

Base path : `/api`

-   Santé: `GET /api/test`
-   CSRF: `GET /api/csrf-token`
-   Auth: `/api/auth` (register, login, logout, profile)
-   Utilisateurs: `/api/users` (get/update/changer mot de passe/supprimer)
-   Studios: `/api/studios` (liste/détail/créer/modifier/supprimer)
-   Disponibilités: `/api/availability` (créneaux, planning hebdo, plage)
-   Planning: `/api/schedule` (récupération/modification du planning d'un studio)
-   Réservations: `/api/reservations` (CRUD + par utilisateur/studio)
-   Avis: `/api/reviews` (liste, créer, modifier, supprimer, stats studio)
-   Tableau de bord (propriétaire studio): `/api/dashboard` (overview, studios, réservations)
-   Rôles: `/api/roles` (liste des rôles disponibles pour inscription)
-   Uploads: `/api/uploads` (images studios, avatar utilisateur)

Fichiers statiques (images) servis sous: `/uploads`.

## Uploads

-   Dossier de stockage: `backend/uploads`
-   Images studio: `/uploads/studios/:studioId/...` (max 5 images, 5 Mo chacune, PNG/JPG/WEBP/GIF)
-   Avatar utilisateur: `/uploads/users/:userId/...` (max 2 Mo)
-   Endpoints d'upload sous `/api/uploads/...` (authentification requise)

## Structure du projet

```
backend/
├── config/            # Connexion MySQL (pool)
│   └── database.js
├── controllers/       # Logique métier
├── middleware/        # Auth, upload, CSRF (configuré dans server.js)
├── models/            # Accès données (users, studios, reservations, reviews)
├── routes/            # Définition des routes /api/*
├── services/          # Règles métier
├── uploads/           # Fichiers uploadés (servis par /uploads)
├── utils/             # Auth JWT, validation Joi, etc.
├── server.js          # Entrée de l'application Express
└── package.json
```

## Exemples rapides

-   Vérifier l'API:
    -   `GET /api/test`
-   Récupérer un token CSRF puis se connecter (avec cookies):
    1. `GET /api/csrf-token`
    2. `POST /api/auth/login` avec en‑tête `X-CSRF-Token` et `credentials` activés
