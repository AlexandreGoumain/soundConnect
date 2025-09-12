import express from "express";
import {
    canUserReview,
    createReview,
    deleteReview,
    getReservationsForReview,
    getReviewById,
    getReviews,
    getStudioStats,
    updateReview,
} from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getReviews);
router.get("/studio/:studio_id/stats", getStudioStats);

// Protected routes (require authentication)
router.use(authenticateToken);

router.post("/", createReview);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.get("/studio/:studio_id/can-review", canUserReview);
router.get("/studio/:studio_id/reservations", getReservationsForReview);

export default router;
