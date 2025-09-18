import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { studioImagesUpload, userAvatarUpload } from "../middleware/upload.js";
import {
    uploadStudioImages,
    deleteStudioImage,
    reorderStudioImages,
    replaceStudioImage,
    uploadUserAvatar,
} from "../controllers/uploadController.js";

const router = express.Router();

// Upload images for a studio (owner only)
router.post(
    "/studios/:id/images",
    authenticateToken,
    studioImagesUpload.array("images", 10),
    uploadStudioImages
);

// Delete a specific image by filename
router.delete(
    "/studios/:id/images/:filename",
    authenticateToken,
    deleteStudioImage
);

// Reorder images by providing full list
router.patch(
    "/studios/:id/images/order",
    authenticateToken,
    reorderStudioImages
);

// Replace a specific image by uploading a new one
router.put(
    "/studios/:id/images/:filename",
    authenticateToken,
    studioImagesUpload.single("image"),
    replaceStudioImage
);

// Upload or replace user avatar
router.post(
    "/users/:id/avatar",
    authenticateToken,
    userAvatarUpload.single("avatar"),
    uploadUserAvatar
);

export default router;
