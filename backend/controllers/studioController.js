import Studio from "../models/Studio.js";

export const createStudio = async (req, res) => {
    try {
        if (req.user.role_name !== "studio") {
            return res.status(403).json({
                success: false,
                message: "Only studio accounts can create studios",
            });
        }

        const studioData = {
            ...req.body,
            owner_id: req.user.id,
        };

        const studio = await Studio.create(studioData);

        res.status(201).json({
            success: true,
            message: "Studio created successfully",
            data: { studio },
        });
    } catch (error) {
        console.error("Error creating studio:", error);

        if (error.message.includes("already in use")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error creating studio",
        });
    }
};

export const getAllStudios = async (req, res) => {
    try {
        const {
            city,
            postal_code,
            min_rate,
            max_rate,
            tags,
            equipment,
            sort,
            available_on,
            duration,
        } = req.query;
        const hasFilters =
            city ||
            postal_code ||
            min_rate ||
            max_rate ||
            tags ||
            equipment ||
            sort ||
            available_on ||
            duration;

        // Validate available_on if present (no past dates)
        if (available_on) {
            const date = new Date(available_on);
            if (isNaN(date.getTime())) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid date format for available_on. Use YYYY-MM-DD",
                });
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const target = new Date(date);
            target.setHours(0, 0, 0, 0);
            if (target < today) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot search availability for past dates",
                });
            }
        }

        const studios = hasFilters
            ? await Studio.findFiltered({
                  city,
                  postal_code,
                  min_rate,
                  max_rate,
                  tags,
                  equipment,
                  sort,
                  available_on,
                  duration,
              })
            : await Studio.findAll();

        res.json({
            success: true,
            data: { studios },
        });
    } catch (error) {
        console.error("Error retrieving studios:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving studios",
        });
    }
};

export const getStudioById = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio.findById(id);

        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        res.json({
            success: true,
            data: { studio },
        });
    } catch (error) {
        console.error("Error retrieving studio:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving studio",
        });
    }
};

export const getStudiosByOwner = async (req, res) => {
    try {
        const { owner_id } = req.params;

        const studios = await Studio.findByOwner(owner_id);

        res.json({
            success: true,
            data: { studios },
        });
    } catch (error) {
        console.error("Error retrieving owner studios:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving owner studios",
        });
    }
};

export const updateStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Get studio to check ownership
        const studio = await Studio.findById(id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        // Check permissions: owner can update their studio
        const isOwner = req.user.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only update your own studios",
            });
        }

        const updatedStudio = await Studio.update(id, updateData);

        if (!updatedStudio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        res.json({
            success: true,
            message: "Studio updated successfully",
            data: { studio: updatedStudio },
        });
    } catch (error) {
        console.error("Error updating studio:", error);

        if (error.message === "No valid data to update") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message.includes("already in use")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Error updating studio",
        });
    }
};

export const deleteStudio = async (req, res) => {
    try {
        const { id } = req.params;

        // Get studio to check ownership
        const studio = await Studio.findById(id);
        if (!studio) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        // Check permissions: owner can delete their studio
        const isOwner = req.user.id === studio.owner_id;
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own studios",
            });
        }

        const deleted = await Studio.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Studio not found",
            });
        }

        res.json({
            success: true,
            message: "Studio deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting studio:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting studio",
        });
    }
};
