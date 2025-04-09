const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EquipmentCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
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

module.exports = mongoose.model("EquipmentCategory", EquipmentCategorySchema);
