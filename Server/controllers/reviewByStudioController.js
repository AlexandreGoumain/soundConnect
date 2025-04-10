const { createStudioReviewSchema } = require("../models/ReviewSchema");
const mongoose = require("mongoose");
const Studio = require("../models/Studio");
const User = require("../models/User");

const StudioReview = mongoose.model("StudioReview", createStudioReviewSchema());

const createReviewByStudioToUser = async (req, res) => {
    const { rating, comment, userIdToReview, studioId, reviewerId } = req.body;

    // Vérifier si l'utilisateur a le rôle de studio
    const studio = await Studio.findById(studioId);
    const userToReview = await User.findById(userIdToReview);

    if (!studio) {
        return res.status(403).json({
            message:
                "Seuls les studios peuvent laisser des avis sur les utilisateurs",
        });
    }

    if (!userToReview) {
        return res.status(403).json({
            message: "L'utilisateur que vous voulez évaluer n'existe pas",
        });
    }

    if (reviewerId === userIdToReview) {
        return res.status(403).json({
            message: "Vous ne pouvez pas évaluer votre propre studio",
        });
    }

    try {
        const review = await StudioReview.create({
            rating,
            comment,
            reviewer_id: studioId,
        });

        userToReview.reviews.push(review);
        await userToReview.save();

        res.status(201).json({ review, userToReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReviewByStudioToUser = async (req, res) => {
    const { rating, comment, reviewerId } = req.body;
    const { reviewId } = req.params;

    try {
        const review = await StudioReview.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "L'avis que vous voulez modifier n'existe plus",
            });
        }

        if (review.reviewer_id.toString() !== reviewerId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier cet avis",
            });
        }

        const updatedReview = await StudioReview.findByIdAndUpdate(
            reviewId,
            {
                rating,
                comment,
            },
            { new: true }
        );

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await StudioReview.findById(reviewId);

        if (!review) {
            return res.status(403).json({
                message: "L'avis que vous voulez modifier n'existe plus",
            });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await StudioReview.find();

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReviewByStudioToUser = async (req, res) => {
    const { reviewId } = req.params;
    const { studioUserId } = req.body;

    try {
        const review = await StudioReview.findById(reviewId);

        if (!review) {
            return res.status(404).json({
                message: "L'avis que vous voulez modifier n'existe plus",
            });
        }

        if (review.reviewer_id.toString() !== studioUserId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier cet avis",
            });
        }

        await StudioReview.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "L'avis a été supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReviewByStudioToUser,
    updateReviewByStudioToUser,
    getReviewById,
    getAllReviews,
    deleteReviewByStudioToUser,
};
