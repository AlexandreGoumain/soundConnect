import {
    StudioError,
    createStudioForOwner,
    deleteStudioForOwner,
    getStudio,
    listStudios,
    listStudiosByOwner,
    updateStudioForOwner,
} from "../services/studioService.js";

export const createStudio = async (req, res) => {
    try {
        const studio = await createStudioForOwner(req.user, req.body);

        res.status(201).json({
            success: true,
            message: "Studio created successfully",
            data: { studio },
        });
    } catch (error) {
        handleStudioError(res, error, "Error creating studio");
    }
};

export const getAllStudios = async (req, res) => {
    try {
        const studios = await listStudios(req.query);

        res.json({
            success: true,
            data: { studios },
        });
    } catch (error) {
        handleStudioError(res, error, "Error retrieving studios");
    }
};

export const getStudioById = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await getStudio(id);

        res.json({
            success: true,
            data: { studio },
        });
    } catch (error) {
        handleStudioError(res, error, "Error retrieving studio");
    }
};

export const getStudiosByOwner = async (req, res) => {
    try {
        const { owner_id } = req.params;
        const studios = await listStudiosByOwner(owner_id);

        res.json({
            success: true,
            data: { studios },
        });
    } catch (error) {
        handleStudioError(res, error, "Error retrieving owner studios");
    }
};

export const updateStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudio = await updateStudioForOwner(
            req.user,
            id,
            req.body
        );

        res.json({
            success: true,
            message: "Studio updated successfully",
            data: { studio: updatedStudio },
        });
    } catch (error) {
        handleStudioError(res, error, "Error updating studio");
    }
};

export const deleteStudio = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteStudioForOwner(req.user, id);

        res.json({
            success: true,
            message: "Studio deleted successfully",
        });
    } catch (error) {
        handleStudioError(res, error, "Error deleting studio");
    }
};

function handleStudioError(res, error, fallbackMessage) {
    if (error instanceof StudioError || typeof error?.statusCode === "number") {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}
