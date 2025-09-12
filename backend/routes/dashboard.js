import express from "express";
import {
    createOwnStudio,
    deleteOwnStudio,
    getOverview,
    getOwnStudioById,
    listOwnReservations,
    listOwnStudios,
    listReservationsForOwnedStudio,
    updateOwnStudio,
} from "../controllers/dashboardController.js";
import { authenticateToken, requireRoles } from "../middleware/auth.js";
import {
    createStudioSchema,
    updateStudioSchema,
    validate,
} from "../utils/validation.js";

const router = express.Router();

// All dashboard routes require authentication and studio role
router.use(authenticateToken, requireRoles(["studio"]));

// High-level overview for the studio owner's dashboard
router.get("/overview", getOverview);

// Studios owned by the authenticated studio account
router.get("/studios", listOwnStudios);
router.get("/studios/:id", getOwnStudioById);
router.post("/studios", validate(createStudioSchema), createOwnStudio);
router.put("/studios/:id", validate(updateStudioSchema), updateOwnStudio);
router.delete("/studios/:id", deleteOwnStudio);

// Reservations across all owned studios
router.get("/reservations", listOwnReservations);

// Reservations for a specific owned studio
router.get("/studios/:id/reservations", listReservationsForOwnedStudio);

export default router;
