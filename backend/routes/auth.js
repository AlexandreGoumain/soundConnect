import express from "express";
import {
    getProfile,
    login,
    logout,
    register,
    updateProfile,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { loginSchema, registerSchema, updateUserSchema, validate } from "../utils/validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", logout);

router.get("/profile", authenticateToken, getProfile);

router.put(
    "/profile",
    authenticateToken,
    validate(updateUserSchema),
    updateProfile
);

export default router;
