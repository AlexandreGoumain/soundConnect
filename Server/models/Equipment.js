const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EquipmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "EquipmentCategory",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Equipment", EquipmentSchema);
