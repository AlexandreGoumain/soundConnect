const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudioReviewSchema = new Schema({
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
    reviewer_id: {
        type: Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("StudioReview", StudioReviewSchema);
