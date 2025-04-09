const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudioEquipmentSchema = new Schema({
    studio_id: {
        type: Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
    },
    equipment_id: {
        type: Schema.Types.ObjectId,
        ref: "Equipment",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model("StudioEquipment", StudioEquipmentSchema);
