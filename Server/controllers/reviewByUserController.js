const UserReview = require("../models/UserReview");
const Studio = require("../models/Studio");
const User = require("../models/User");

const createReviewByUserToStudio = async (req, res) => {
    const { rating, comment, userId, studioToReviewId } = req.body;

    try {
        const studioToReview = await Studio.findById(studioToReviewId);
        if (!studioToReview) {
            return res.status(404).json({
                message: "Le studio que vous voulez évaluer n'existe pas",
            });
        }

        if (studioToReview.owner_id.toString() === userId) {
            return res.status(403).json({
                message: "Vous ne pouvez pas évaluer votre propre studio",
            });
        }

        const review = await UserReview.create({
            rating,
            comment,
            reviewer_id: userId,
            studio_id: studioToReviewId,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReviewByUserToStudio = async (req, res) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est dans le token

    try {
        const review = await UserReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "L'avis que vous voulez modifier n'existe pas",
            });
        }

        if (review.reviewer_id.toString() !== userId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier cet avis",
            });
        }

        const updatedReview = await UserReview.findByIdAndUpdate(
            reviewId,
            { rating, comment, updated_at: Date.now() },
            { new: true }
        );

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReviewByUserToStudio = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id; // Supposons que l'ID de l'utilisateur est dans le token

    try {
        const review = await UserReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                message: "L'avis que vous voulez supprimer n'existe pas",
            });
        }

        if (review.reviewer_id.toString() !== userId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à supprimer cet avis",
            });
        }

        await UserReview.findByIdAndDelete(reviewId);
        res.status(200).json({ message: "Avis supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllReviewsMadeByUserToStudio = async (req, res) => {
    try {
        const reviews = await UserReview.find()
            .populate("reviewer_id", "username")
            .populate("studio_id", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewsByStudio = async (req, res) => {
    const { studioId } = req.params;
    try {
        const reviews = await UserReview.find({ studio_id: studioId })
            .populate("reviewer_id", "username")
            .populate("studio_id", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const reviews = await UserReview.find({ reviewer_id: userId })
            .populate("reviewer_id", "username")
            .populate("studio_id", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReviewByUserToStudio,
    updateReviewByUserToStudio,
    deleteReviewByUserToStudio,
    getAllReviewsMadeByUserToStudio,
    getReviewsByStudio,
    getReviewsByUser,
};
