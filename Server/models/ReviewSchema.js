const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schéma de base pour les reviews
const baseReviewSchema = {
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
};

// Création du schéma pour les reviews d'un utilisateur (par un studio)
const createUserReviewSchema = () => {
    return new Schema({
        ...baseReviewSchema,
        reviewer_id: {
            type: Schema.Types.ObjectId,
            ref: "Studio",
            required: true,
        },
    });
};

// Création du schéma pour les reviews d'un studio (par un utilisateur)
const createStudioReviewSchema = () => {
    return new Schema({
        ...baseReviewSchema,
        reviewer_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    });
};

module.exports = {
    createUserReviewSchema,
    createStudioReviewSchema,
};
