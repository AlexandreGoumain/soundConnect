const app = require("./app");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(
        `Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`
    );
});
