const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    alt_text: {
        type: String,
        required: true,
    },
    studio_id: {
        type: Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Image", ImageSchema);
