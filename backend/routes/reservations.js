import express from "express";

import {
    createReservation,
    deleteReservation,
    getAllReservations,
    getReservationById,
    getReservationsByStudio,
    getReservationsByUser,
    updateReservation,
} from "../controllers/reservationController.js";

import {
    authenticateToken,
    optionalAuth,
    requireRoles,
} from "../middleware/auth.js";

import {
    createReservationSchema,
    updateReservationSchema,
    validate,
} from "../utils/validation.js";

const router = express.Router();

// Main reservation routes
router.get("/", authenticateToken, getAllReservations);
router.post(
    "/",
    authenticateToken,
    requireRoles(["artist"]),
    validate(createReservationSchema),
    createReservation
);
router.get("/:id", authenticateToken, getReservationById);
router.put(
    "/:id",
    authenticateToken,
    validate(updateReservationSchema),
    updateReservation
);
router.delete("/:id", authenticateToken, deleteReservation);

// Additional routes for specific queries
router.get("/user/:user_id", authenticateToken, getReservationsByUser);
router.get("/studio/:studio_id", optionalAuth, getReservationsByStudio);
// router.get("/studio/:studio_id/stats", authenticateToken, getStudioStats);

export default router;
