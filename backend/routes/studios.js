import express from "express";
import {
    createStudio,
    deleteStudio,
    getAllStudios,
    getStudioById,
    getStudiosByOwner,
    updateStudio,
} from "../controllers/studioController.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import {
    createStudioSchema,
    updateStudioSchema,
    validate,
} from "../utils/validation.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", optionalAuth, getAllStudios);
router.get("/:id", optionalAuth, getStudioById);
router.get("/owner/:owner_id", optionalAuth, getStudiosByOwner);

// Protected routes (authentication required)
router.post("/", authenticateToken, validate(createStudioSchema), createStudio);

router.put(
    "/:id",
    authenticateToken,
    validate(updateStudioSchema),
    updateStudio
);

router.delete("/:id", authenticateToken, deleteStudio);

export default router;
