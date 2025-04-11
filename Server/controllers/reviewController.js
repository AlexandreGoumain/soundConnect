const Studio = require("../models/Studio");
const User = require("../models/User");

// Méthodes générales
const getReviewById = async (req, res) => {
    const { reviewId } = req.params;

    try {
        // Chercher dans les studios
        const studios = await Studio.find().populate("reviews");
        const studioReview = studios.reduce((found, studio) => {
            if (found) return found;
            return studio.reviews.find(
                (review) => review._id.toString() === reviewId
            );
        }, null);

        // Chercher dans les utilisateurs
        const users = await User.find().populate("reviews");
        const userReview = users.reduce((found, user) => {
            if (found) return found;
            return user.reviews.find(
                (review) => review._id.toString() === reviewId
            );
        }, null);

        if (!studioReview && !userReview) {
            return res.status(404).json({
                message: "L'avis que vous cherchez n'existe pas",
            });
        }

        res.status(200).json(studioReview || userReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const studios = await Studio.find().populate("reviews");
        const users = await User.find().populate("reviews");

        const studioReviews = studios.reduce((acc, studio) => {
            if (studio.reviews && studio.reviews.length > 0) {
                return [...acc, ...studio.reviews];
            }
            return acc;
        }, []);

        const userReviews = users.reduce((acc, user) => {
            if (user.reviews && user.reviews.length > 0) {
                return [...acc, ...user.reviews];
            }
            return acc;
        }, []);

        res.status(200).json({
            reviewsByStudios: studioReviews,
            reviewsByUsers: userReviews,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviewById,
    getAllReviews,
};
