const Studio = require("../models/Studio");
const { studioValidator } = require("../middlewares/StudioValidator");
const User = require("../models/User");
const Role = require("../models/Role");

const createStudio = async (req, res) => {
    const { error, value } = studioValidator.validate(req.body);

    const existingStudio = await Studio.findOne({ email: value.email });
    const existingStudioPhone = await Studio.findOne({ phone: value.phone });
    const existingStudioAddress = await Studio.findOne({
        address: value.address,
    });

    const owner = await User.findById(value.owner_id);
    const IdRoleStudio = await Role.findOne({ name: "Studio" });

    if (!owner.roles.includes(IdRoleStudio._id)) {
        return res.status(400).json({
            message: "Vous n'avez pas les droits pour créer un studio",
        });
    }

    if (existingStudio) {
        return res.status(400).json({ message: "Email déjà utilisé" });
    }

    if (existingStudioPhone) {
        return res
            .status(400)
            .json({ message: "Numéro de téléphone déjà utilisé" });
    }
    if (existingStudioAddress) {
        return res.status(400).json({ message: "Adresse déjà utilisée" });
    }

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const studio = await Studio.create({
            ...value,
            owner_id: owner._id,
        });

        return res.status(201).json({ studio });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllStudios = async (req, res) => {
    try {
        const studios = await Studio.find();
        return res.status(200).json({ studios });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getStudioById = async (req, res) => {
    const { id } = req.params;

    try {
        const studio = await Studio.findById(id);

        if (!studio) {
            return res.status(404).json({ message: "Studio non trouvé" });
        }

        return res.status(200).json({ studio });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateStudio = async (req, res) => {
    const { id } = req.params;

    const { error, value } = studioValidator.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const studio = await Studio.findByIdAndUpdate(id, value, { new: true });
        return res.status(200).json({ studio });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteStudio = async (req, res) => {
    const { id } = req.params;

    try {
        const studio = await Studio.findById(id);

        if (!studio) {
            return res.status(404).json({ message: "Studio non trouvé" });
        }

        await Studio.findByIdAndDelete(id);

        return res.status(200).json({ message: "Studio supprimé avec succès" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getStudioByOwnerId = async (req, res) => {
    const { id } = req.params;

    const owner = await User.findById(id);
    const IdRoleStudio = await Role.findOne({ name: "Studio" });

    if (!owner) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!owner.roles.includes(IdRoleStudio._id)) {
        return res.status(400).json({
            message: "L'utilisateur n'a pas les droits pour avoir un studio",
        });
    }

    try {
        const studios = await Studio.find({ owner_id: owner._id });

        if (studios.length === 0) {
            return res
                .status(404)
                .json({ message: "Aucun studio trouvé pour cet utilisateur" });
        }

        return res.status(200).json({ studios });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getStudioByTag = async (req, res) => {
    const { tag } = req.params;

    const normalizedTag = tag.trim().toLowerCase();

    try {
        const studios = await Studio.find({
            tags: {
                $elemMatch: {
                    $regex: new RegExp(`^${normalizedTag}$`, "i"),
                },
            },
        });

        if (studios.length === 0) {
            return res.status(404).json({ message: "Aucun studio trouvé" });
        }

        return res.status(200).json({ studios });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStudio,
    getAllStudios,
    getStudioById,
    updateStudio,
    deleteStudio,
    getStudioByOwnerId,
    getStudioByTag,
};
