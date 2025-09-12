import Review from "../models/Review.js";

export const createReview = async (req, res) => {
    try {
        const { studio_id, reservation_id, rating, comment } = req.body;
        const user_id = req.user.id;

        // Validate required fields
        if (!studio_id || !reservation_id || !rating) {
            return res.status(400).json({
                success: false,
                message: "Studio ID, reservation ID, and rating are required",
            });
        }

        const review = await Review.create({
            user_id,
            studio_id,
            reservation_id,
            rating,
            comment,
        });

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { studio_id, user_id } = req.query;
        let reviews;

        if (studio_id) {
            reviews = await Review.findByStudio(studio_id);
        } else if (user_id) {
            reviews = await Review.findByUser(user_id);
        } else {
            reviews = await Review.findAll();
        }

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
        });
    }
};

export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (review.user_id !== user_id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only access your own reviews",
            });
        }

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching review",
        });
    }
};

export const getStudioStats = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const stats = await Review.getStudioStats(studio_id);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Error fetching studio stats:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching studio statistics",
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user.id;

        // Check if review exists and belongs to user
        const existingReview = await Review.findById(id);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (existingReview.user_id !== user_id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only update your own reviews",
            });
        }

        const updateData = {};
        if (rating !== undefined) updateData.rating = rating;
        if (comment !== undefined) updateData.comment = comment;

        const updatedReview = await Review.update(id, updateData);

        if (!updatedReview) {
            return res.status(400).json({
                success: false,
                message: "Failed to update review",
            });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview,
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Check if review exists and belongs to user
        const existingReview = await Review.findById(id);
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (existingReview.user_id !== user_id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own reviews",
            });
        }

        const deleted = await Review.delete(id);

        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete review",
            });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting review",
        });
    }
};

export const canUserReview = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const user_id = req.user.id;

        const result = await Review.canUserReview(user_id, studio_id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error checking review eligibility:", error);
        res.status(500).json({
            success: false,
            message: "Error checking review eligibility",
        });
    }
};

export const getReservationsForReview = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const user_id = req.user.id;

        const reservations = await Review.getReservationsForReview(
            user_id,
            studio_id
        );

        res.status(200).json({
            success: true,
            data: reservations,
        });
    } catch (error) {
        console.error("Error fetching reservations for review:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reservations for review",
        });
    }
};
