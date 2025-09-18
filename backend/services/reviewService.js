import Review from "../models/Review.js";

class ReviewError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const ensureOwnedReview = (review, userId) => {
    if (review.user_id !== userId) {
        throw new ReviewError(403, "Unauthorized: You can only access your own reviews");
    }
};

export async function createReviewForUser(user, payload) {
    const { studio_id, reservation_id, rating, comment } = payload;

    if (!studio_id || !reservation_id || !rating) {
        throw new ReviewError(
            400,
            "Studio ID, reservation ID, and rating are required"
        );
    }

    return Review.create({
        user_id: user.id,
        studio_id,
        reservation_id,
        rating,
        comment,
    });
}

export async function listReviews(filters = {}) {
    const { studio_id, user_id } = filters;

    if (studio_id) {
        return Review.findByStudio(studio_id);
    }

    if (user_id) {
        return Review.findByUser(user_id);
    }

    return Review.findAll();
}

export async function getReviewForUser(user, reviewId) {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ReviewError(404, "Review not found");
    }

    ensureOwnedReview(review, user.id);
    return review;
}

export async function getStudioReviewStats(studioId) {
    return Review.getStudioStats(studioId);
}

export async function updateReviewForUser(user, reviewId, payload) {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ReviewError(404, "Review not found");
    }

    ensureOwnedReview(review, user.id);

    const updateData = {};
    if (payload.rating !== undefined) updateData.rating = payload.rating;
    if (payload.comment !== undefined) updateData.comment = payload.comment;

    if (Object.keys(updateData).length === 0) {
        throw new ReviewError(400, "No valid review data provided");
    }

    const updatedReview = await Review.update(reviewId, updateData);

    if (!updatedReview) {
        throw new ReviewError(400, "Failed to update review");
    }

    return updatedReview;
}

export async function deleteReviewForUser(user, reviewId) {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ReviewError(404, "Review not found");
    }

    ensureOwnedReview(review, user.id);

    const deleted = await Review.delete(reviewId);

    if (!deleted) {
        throw new ReviewError(400, "Failed to delete review");
    }

    return true;
}

export async function canUserLeaveReview(user, studioId) {
    return Review.canUserReview(user.id, studioId);
}

export async function getEligibleReservationsForReview(user, studioId) {
    return Review.getReservationsForReview(user.id, studioId);
}

export { ReviewError };
