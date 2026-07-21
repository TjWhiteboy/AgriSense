const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    userMessage: {
        type: String,
        required: true
    },

    aiReply: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    hasImage: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Chat", chatSchema);
