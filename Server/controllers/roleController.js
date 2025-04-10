const { roleValidator } = require("../middlewares/roleValidator");
const Role = require("../models/Role");

const createRole = async (req, res) => {
    const { name, description } = req.body;

    const existingRole = await Role.findOne({ name });

    if (existingRole) {
        return res
            .status(400)
            .json({ message: "Un rôle avec ce nom existe déjà" });
    }

    try {
        const { error, value } = roleValidator.validate({ name, description });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const newRole = await Role.create(value);

        return res.status(201).json({ newRole });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();

        return res.status(200).json({ roles });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getRoleById = async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findById(id);

        if (!role) {
            return res.status(404).json({ message: "Role non trouvé" });
        }

        return res.status(200).json({ role });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateRole = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const { error, value } = roleValidator.validate({ name, description });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const role = await Role.findByIdAndUpdate(id, value, { new: true });

        if (!role) {
            return res.status(404).json({ message: "Rôle non trouvé" });
        }

        return res.status(200).json({ role });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        const roleToDelete = await Role.findByIdAndDelete(id);

        if (!roleToDelete) {
            return res.status(404).json({ message: "Rôle non trouvé" });
        } else {
            return res
                .status(200)
                .json({ message: "Rôle supprimé avec succès" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};
