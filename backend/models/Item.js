const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Lost", "Found"],
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },
        imageUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Item", itemSchema)