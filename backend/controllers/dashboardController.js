import { pool } from "../config/database.js";
import Reservation from "../models/Reservation.js";
import Review from "../models/Review.js";
import Studio from "../models/Studio.js";

export const getOverview = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Counts and revenue
        const [counts] = await pool.execute(
            `SELECT
                (SELECT COUNT(*) FROM studios WHERE owner_id = ?) AS total_studios,
                (SELECT COUNT(*) FROM reservations r JOIN studios s ON r.studio_id = s.id WHERE s.owner_id = ?) AS total_reservations,
                (SELECT SUM(r.total_price) FROM reservations r JOIN studios s ON r.studio_id = s.id WHERE s.owner_id = ? AND r.status = 'completed') AS total_revenue`,
            [ownerId, ownerId, ownerId]
        );

        // Reservations by status
        const [byStatus] = await pool.execute(
            `SELECT r.status, COUNT(*) as count
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             WHERE s.owner_id = ?
             GROUP BY r.status`,
            [ownerId]
        );

        // Average rating across owned studios
        const [avgRatingRows] = await pool.execute(
            `SELECT AVG(r.rating) as average_rating, COUNT(*) as total_reviews
             FROM reviews r
             JOIN studios s ON r.studio_id = s.id
             WHERE s.owner_id = ?`,
            [ownerId]
        );
        const avgRating = avgRatingRows[0]?.average_rating || 0;
        const totalReviews = avgRatingRows[0]?.total_reviews || 0;

        // Upcoming reservations (no limit)
        const [upcoming] = await pool.execute(
            `SELECT r.id, r.start_datetime, r.end_datetime, r.status,
                    u.first_name, u.last_name, u.username,
                    s.id as studio_id, s.name as studio_name
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             JOIN users u ON r.user_id = u.id
             WHERE s.owner_id = ? AND r.status IN ('pending','confirmed') AND r.start_datetime >= NOW()
             ORDER BY r.start_datetime ASC`,
            [ownerId]
        );

        res.json({
            success: true,
            data: {
                totals: {
                    total_studios: Number(counts[0].total_studios || 0),
                    total_reservations: Number(
                        counts[0].total_reservations || 0
                    ),
                    total_revenue: Number(counts[0].total_revenue || 0),
                },
                reservations_by_status: byStatus,
                rating: {
                    average: Number(avgRating) || 0,
                    total_reviews: Number(totalReviews) || 0,
                },
                upcoming,
            },
        });
    } catch (error) {
        console.error("Error building dashboard overview:", error);
        res.status(500).json({
            success: false,
            message: "Error building dashboard overview",
        });
    }
};

export const listOwnStudios = async (req, res) => {
    try {
        const ownerId = req.user.id;
        // All studios for this owner (no pagination)
        const [rows] = await pool.execute(
            `SELECT s.* FROM studios s WHERE s.owner_id = ? ORDER BY s.created_at DESC`,
            [ownerId]
        );

        // Attach review stats to each studio (reuse Review.getStudioStats)
        for (const studio of rows) {
            studio.review_stats = await Review.getStudioStats(studio.id);
        }

        res.json({ success: true, data: { studios: rows } });
    } catch (error) {
        console.error("Error listing own studios:", error);
        res.status(500).json({
            success: false,
            message: "Error listing studios",
        });
    }
};

export const getOwnStudioById = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;
        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }
        if (studio.owner_id !== ownerId) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });
        }
        res.json({ success: true, data: { studio } });
    } catch (error) {
        console.error("Error getting owned studio:", error);
        res.status(500).json({
            success: false,
            message: "Error getting studio",
        });
    }
};

export const createOwnStudio = async (req, res) => {
    try {
        // Owner is the authenticated user
        const studio = await Studio.create({
            ...req.body,
            owner_id: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: "Studio created successfully",
            data: { studio },
        });
    } catch (error) {
        console.error("Error creating owned studio:", error);
        if (error.message?.includes("already in use")) {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }
        res.status(500).json({
            success: false,
            message: "Error creating studio",
        });
    }
};

export const updateOwnStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }
        const isOwner = req.user.id === studio.owner_id;
        if (!isOwner) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });
        }

        const updated = await Studio.update(id, req.body);
        res.json({
            success: true,
            message: "Studio updated successfully",
            data: { studio: updated },
        });
    } catch (error) {
        console.error("Error updating owned studio:", error);
        if (error.message === "No valid data to update") {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }
        if (error.message?.includes("already in use")) {
            return res
                .status(400)
                .json({ success: false, message: error.message });
        }
        res.status(500).json({
            success: false,
            message: "Error updating studio",
        });
    }
};

export const deleteOwnStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio.findById(id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }
        const isOwner = req.user.id === studio.owner_id;
        if (!isOwner) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });
        }

        const deleted = await Studio.delete(id);
        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }
        res.json({ success: true, message: "Studio deleted successfully" });
    } catch (error) {
        console.error("Error deleting owned studio:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting studio",
        });
    }
};

export const listOwnReservations = async (req, res) => {
    try {
        const ownerId = req.user.id;
        // All reservations across owned studios (no pagination)
        const [rows] = await pool.execute(
            `SELECT r.*, u.username, u.first_name, u.last_name, u.email as user_email,
                    s.name as studio_name, s.id as studio_id
             FROM reservations r
             JOIN studios s ON r.studio_id = s.id
             JOIN users u ON r.user_id = u.id
             WHERE s.owner_id = ?
             ORDER BY r.start_datetime DESC`,
            [ownerId]
        );

        res.json({ success: true, data: { reservations: rows } });
    } catch (error) {
        console.error("Error listing own reservations:", error);
        res.status(500).json({
            success: false,
            message: "Error listing reservations",
        });
    }
};

export const listReservationsForOwnedStudio = async (req, res) => {
    try {
        const { id: studio_id } = req.params;
        const studio = await Studio.findById(studio_id);
        if (!studio) {
            return res
                .status(404)
                .json({ success: false, message: "Studio not found" });
        }
        const isOwner = req.user.id === studio.owner_id;
        if (!isOwner) {
            return res
                .status(403)
                .json({ success: false, message: "Unauthorized" });
        }

        // Delegate to model with full detail since owner
        const reservations = await Reservation.findByStudio(studio_id);
        res.json({ success: true, data: { reservations } });
    } catch (error) {
        console.error("Error listing reservations for owned studio:", error);
        res.status(500).json({
            success: false,
            message: "Error listing studio reservations",
        });
    }
};
