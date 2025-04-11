const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    city: {
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
        required: false,
    },
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tags: {
        required: false,
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
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        tuesday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        wednesday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        thursday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        friday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        saturday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
        },
        sunday: {
            is_open: { type: Boolean, default: false },
            open: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
            close: {
                hour: { type: Number, min: 0, max: 23 },
                minute: { type: Number, min: 0, max: 59 },
            },
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
});

module.exports = mongoose.model("Studio", StudioSchema);
