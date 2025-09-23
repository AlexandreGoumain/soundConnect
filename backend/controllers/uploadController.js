import {
    UploadError,
    appendStudioImages,
    removeStudioImage,
    reorderStudioImages as reorderStudioImagesService,
    replaceStudioImage as replaceStudioImageService,
    uploadUserAvatar as uploadUserAvatarService,
} from "../services/uploadService.js";

export const uploadStudioImages = async (req, res) => {
    try {
        const { id } = req.params;
        const images = await appendStudioImages(id, req.user, req.files);

        res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: { images },
        });
    } catch (error) {
        handleUploadError(
            res,
            error,
            "Error uploading images. Please try again."
        );
    }
};

export const deleteStudioImage = async (req, res) => {
    try {
        const { id, filename } = req.params;
        const images = await removeStudioImage(id, req.user, filename);

        res.json({
            success: true,
            message: "Image deleted successfully",
            data: { images },
        });
    } catch (error) {
        handleUploadError(res, error, "Error deleting image");
    }
};

export const reorderStudioImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { images } = req.body || {};
        const normalized = await reorderStudioImagesService(
            id,
            req.user,
            images
        );

        res.json({
            success: true,
            message: "Images reordered successfully",
            data: { images: normalized },
        });
    } catch (error) {
        handleUploadError(res, error, "Error reordering images");
    }
};

export const replaceStudioImage = async (req, res) => {
    try {
        const { id, filename } = req.params;
        const images = await replaceStudioImageService(
            id,
            req.user,
            filename,
            req.file
        );

        res.json({
            success: true,
            message: "Image replaced successfully",
            data: { images },
        });
    } catch (error) {
        handleUploadError(res, error, "Error replacing image");
    }
};
export const uploadUserAvatar = async (req, res) => {
    try {
        const { id } = req.params;
        const avatarUrl = await uploadUserAvatarService(id, req.user, req.file);

        res.status(201).json({
            success: true,
            message: "Avatar uploaded successfully",
            data: { avatar_url: avatarUrl },
        });
    } catch (error) {
        handleUploadError(res, error, "Error uploading avatar");
    }
};
function handleUploadError(res, error, fallbackMessage) {
    if (error instanceof UploadError || typeof error?.statusCode === "number") {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}
