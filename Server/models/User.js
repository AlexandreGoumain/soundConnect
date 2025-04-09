const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createUserReviewSchema } = require("./ReviewSchema");

// Utilisation du schéma de review réutilisable
const ReviewSchema = createUserReviewSchema();

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Remplacer role_id par un tableau roles
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    // Reviews intégrées dans le document utilisateur
    reviews: [ReviewSchema],
});

module.exports = mongoose.model("User", UserSchema);
