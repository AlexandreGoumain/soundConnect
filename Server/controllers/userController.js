const {
    userCreateValidator,
    userUpdateValidator,
    passwordUpdateValidator,
} = require("../middlewares/UserValidator");

const User = require("../models/User");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");

const createUserItSelf = async (req, res) => {
    let { username, email, password, roles } = req.body;

    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUser && existingUsername) {
        return res.status(400).json({
            message: "cet email et ce nom d'utilisateur existent déjà",
        });
    }

    if (existingUser) {
        return res.status(400).json({
            message: "cet email existe déjà",
        });
    }

    if (existingUsername) {
        return res.status(400).json({
            message: "ce nom d'utilisateur existe déjà",
        });
    }

    try {
        // Récupérer les rôles autorisés (artiste/client et studio)
        const allowedRoles = await Role.find({
            name: { $in: ["Studio", "studio", "Artiste", "artiste"] },
        });
        const allowedRoleIds = allowedRoles.map((role) => role._id.toString());

        // Vérifiez si roles est défini et est un tableau, sinon initialisez-le
        let filteredRoles = [];
        if (roles) {
            // Assurez-vous que roles est un tableau
            const rolesArray = Array.isArray(roles) ? roles : [roles];

            // Filtrer les rôles autorisés
            filteredRoles = rolesArray.filter((roleId) => {
                // Convertir en string s'il s'agit d'un ObjectId ou d'un autre objet
                const roleIdStr = roleId.toString ? roleId.toString() : roleId;
                return allowedRoleIds.includes(roleIdStr);
            });
        }

        // Si aucun rôle valide n'est fourni, attribuer le rôle artiste par défaut
        if (filteredRoles.length === 0) {
            const artisteRole = allowedRoles.find(
                (role) => role.name === "Artiste" || role.name === "artiste"
            );
            if (artisteRole) {
                filteredRoles.push(artisteRole._id);
            }
        }

        const { error, value } = userCreateValidator.validate({
            username,
            email,
            password,
            roles: filteredRoles,
        });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const NewUser = await User.create({
            ...value,
            password: hashedPassword,
        });

        return res.status(201).json({ NewUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, roles } = req.body;

    try {
        // Validation des données d'entrée
        const { error, value } = userUpdateValidator.validate({
            username,
            email,
            roles,
        });

        // Récupérer les rôles autorisés (artiste/client et studio)
        const allowedRoles = await Role.find({
            name: { $in: ["Studio", "studio", "Artiste", "artiste"] },
        });
        const allowedRoleIds = allowedRoles.map((role) => role._id.toString());

        // Vérifiez si roles est défini et est un tableau, sinon initialisez-le
        let filteredRoles = [];
        if (roles) {
            // Assurez-vous que roles est un tableau
            const rolesArray = Array.isArray(roles) ? roles : [roles];

            // Filtrer les rôles autorisés
            filteredRoles = rolesArray.filter((roleId) => {
                // Convertir en string s'il s'agit d'un ObjectId ou d'un autre objet
                const roleIdStr = roleId.toString ? roleId.toString() : roleId;
                return allowedRoleIds.includes(roleIdStr);
            });
        }

        // Si aucun rôle valide n'est fourni, attribuer le rôle artiste par défaut
        if (filteredRoles.length === 0) {
            const artisteRole = allowedRoles.find(
                (role) => role.name === "Artiste" || role.name === "artiste"
            );
            if (artisteRole) {
                filteredRoles.push(artisteRole._id);
            }
        }

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Mettre à jour avec les rôles filtrés
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...value, roles: filteredRoles },
            { new: true }
        );

        return res.status(200).json({ updatedUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // Validation des données d'entrée
        const { error, value } = passwordUpdateValidator.validate({
            currentPassword,
            newPassword,
        });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Trouver l'utilisateur
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier si le mot de passe actuel est correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Mot de passe actuel incorrect" });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        await User.findByIdAndUpdate(
            id,
            {
                password: hashedPassword,
            },
            { new: true }
        );

        return res
            .status(200)
            .json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        return res
            .status(200)
            .json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUserItSelf,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};

// Blablabla@1!()()
