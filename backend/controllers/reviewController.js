import {
    ReviewError,
    canUserLeaveReview,
    createReviewForUser,
    deleteReviewForUser,
    getEligibleReservationsForReview,
    getReviewForUser,
    getStudioReviewStats,
    listReviews,
    updateReviewForUser,
} from "../services/reviewService.js";

export const createReview = async (req, res) => {
    try {
        const review = await createReviewForUser(req.user, req.body);

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    } catch (error) {
        handleReviewError(res, error, "Error creating review");
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await listReviews(req.query);

        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        handleReviewError(res, error, "Error fetching reviews");
    }
};

export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await getReviewForUser(req.user, id);

        res.status(200).json({
            success: true,
            data: review,
        });
    } catch (error) {
        handleReviewError(res, error, "Error fetching review");
    }
};

export const getStudioStats = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const stats = await getStudioReviewStats(studio_id);

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        handleReviewError(res, error, "Error fetching studio statistics");
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await updateReviewForUser(req.user, id, req.body);

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview,
        });
    } catch (error) {
        handleReviewError(res, error, "Error updating review");
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteReviewForUser(req.user, id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        handleReviewError(res, error, "Error deleting review");
    }
};

export const canUserReview = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const result = await canUserLeaveReview(req.user, studio_id);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        handleReviewError(res, error, "Error checking review eligibility");
    }
};

export const getReservationsForReview = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const reservations = await getEligibleReservationsForReview(
            req.user,
            studio_id
        );

        res.status(200).json({
            success: true,
            data: reservations,
        });
    } catch (error) {
        handleReviewError(res, error, "Error fetching reservations for review");
    }
};

function handleReviewError(res, error, fallbackMessage) {
    if (error instanceof ReviewError || typeof error?.statusCode === "number") {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}
