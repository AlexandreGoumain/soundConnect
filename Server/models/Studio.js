const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { createStudioReviewSchema } = require("./ReviewSchema");

// Utilisation du schéma de review réutilisable
const ReviewSchema = createStudioReviewSchema();

const StudioSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    hourly_rate: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (tags) {
                return tags.length <= 5;
            },
            message: "Vous ne pouvez pas avoir plus de 5 tags",
        },
    },
    operating_hours: {
        monday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        tuesday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        wednesday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        thursday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        friday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        saturday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
        sunday: {
            open: { type: String, min: "00:00", max: "24:00" },
            close: { type: String, min: "00:00", max: "24:00" },
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    // Reviews intégrées dans le document studio
    reviews: [ReviewSchema],
});

module.exports = mongoose.model("Studio", StudioSchema);
