const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate("roles");
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // Préparation des données utilisateur (sans le mot de passe)
        const userData = {
            _id: user._id,
            email: user.email,
            username: user.username,
            roles: user.roles,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        return res.status(200).json({
            token,
            user: userData,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
};
