import express from "express";
import {
    changePassword,
    deleteUser,
    getUserById,
    updateProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
    changePasswordSchema,
    updateUserSchema,
    validate,
} from "../utils/validation.js";

const router = express.Router();

router.get("/:id", authenticateToken, getUserById);

router.put(
    "/:id",
    authenticateToken,
    validate(updateUserSchema),
    updateProfile
);

router.put(
    "/:id/password",
    authenticateToken,
    validate(changePasswordSchema),
    changePassword
);

router.delete("/:id", authenticateToken, deleteUser);

export default router;
