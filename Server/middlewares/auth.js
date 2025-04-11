const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Utilisateur non trouvé" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};

const isArtist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate("roles");
        const isArtist = user.roles.some((role) => role.name === "Artist");

        if (!isArtist) {
            return res
                .status(403)
                .json({ message: "Accès réservé aux artistes" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isStudio = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate("roles");
        const isStudio = user.roles.some((role) => role.name === "Studio");

        if (!isStudio) {
            return res
                .status(403)
                .json({ message: "Accès réservé aux studios" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        // Vérifier le token d'authentification
        const token = req.headers.authorization;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Authentification requise" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({ message: "Token invalide" });
        }

        // Récupérer l'utilisateur avec ses rôles
        const user = await User.findById(req.user.userId).populate("roles");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Chercher le rôle "admin" dans la collection Role
        const adminRole = await Role.findOne({ name: "Admin" });

        if (!adminRole) {
            return res
                .status(500)
                .json({ message: "le rôle Admin n'existe pas" });
        }

        // Vérifier si l'utilisateur a le rôle d'administrateur
        const hasAdminRole = user.roles.some(
            (role) => role._id.toString() === adminRole._id.toString()
        );

        if (!hasAdminRole) {
            return res.status(403).json({
                message:
                    "Accès refusé, vous n'avez pas les droits pour accéder à cette ressource",
            });
        }

        // Si l'utilisateur a le rôle d'administrateur, passer à la suite
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    isAuthenticated,
    isArtist,
    isStudio,
    isAdmin,
};
