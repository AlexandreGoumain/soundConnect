# SoundConnect Backend

Backend API pour la plateforme de réservation de studios SoundConnect.

## Configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la base de données

-   Assurez-vous que MySQL est installé et en cours d'exécution
-   Créez la base de données en exécutant le fichier SQL :

```bash
mysql -u root -p < soundconnect_db.sql
```

Note: ce script recrée le schéma complet (DROP puis CREATE) et est destiné aux environnements de développement.

### 3. Variables d'environnement

Créez un fichier `.env` à la racine du projet backend avec :

```
DB_HOST=votre_url
DB_PORT=votre_port
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_nom_de_base_de_donnees
NODE_ENV=development
JWT_SECRET=votre_cle_secrete_jwt
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:votre_port
```

### 4. Démarrage du serveur

```bash
# Mode développement (avec auto-restart)
npm run dev

# Mode production
npm start
```

## API Endpoints

### Test Check

-   `GET /api/test` - Vérification du statut de l'API

## Structure du projet

```
backend/
├── config/
│   └── database.js       # Configuration MySQL
├── controllers/          # Logique métier des routes
├── middleware/          # Middleware personnalisés
├── models/             # Modèles de données
├── routes/             # Définition des routes
├── utils/              # Utilitaires
├── server.js           # Point d'entrée de l'application
└── package.json
```
