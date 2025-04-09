const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    studio_id: {
        type: Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    start_datetime: {
        type: Date,
        required: true,
    },
    end_datetime: {
        type: Date,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled", "completed"],
        default: "pending",
    },
    special_requests: {
        type: String,
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

module.exports = mongoose.model("Reservation", ReservationSchema);
