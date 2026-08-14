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

        // User who created the report
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Report lifecycle
        status: {
            type: String,
            enum: ["Active", "Resolved"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Item", itemSchema)