const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const isStudio = async (req, res, next) => {
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
            return res.status(401).json({ message: "Invalid token" });
        }

        // Récupérer l'utilisateur avec ses rôles
        const user = await User.findById(req.user.userId).populate("roles");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Chercher le rôle "studio" dans la collection Role
        const studioRole = await Role.findOne({ name: "Studio" });

        if (!studioRole) {
            return res
                .status(500)
                .json({ message: "le rôle Studio n'existe pas" });
        }

        // Vérifier si l'utilisateur a le rôle de studio
        const hasStudioRole = user.roles.some(
            (role) => role._id.toString() === studioRole._id.toString()
        );

        if (!hasStudioRole) {
            return res.status(403).json({
                message:
                    "Accès refusé, vous n'avez pas les droits pour accéder à cette ressource",
            });
        }

        // Si l'utilisateur a le rôle de studio, passer à la suite
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const isArtist = async (req, res, next) => {
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

        // Chercher le rôle "Artiste" dans la collection Role
        const artistRole = await Role.findOne({ name: "Artiste" });

        if (!artistRole) {
            return res
                .status(500)
                .json({ message: "le rôle Artiste n'existe pas" });
        }

        // Vérifier si l'utilisateur a le rôle d'artiste
        const hasArtistRole = user.roles.some(
            (role) => role._id.toString() === artistRole._id.toString()
        );

        if (!hasArtistRole) {
            return res.status(403).json({
                message:
                    "Accès refusé, vous n'avez pas les droits pour accéder à cette ressource",
            });
        }

        // Si l'utilisateur a le rôle d'artiste, passer à la suite
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

module.exports = { authenticateToken, isStudio, isArtist, isAdmin };
