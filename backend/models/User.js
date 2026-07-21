const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    preferredCrop: { type: String, default: '' },
    language: { type: String, default: 'en' },
    profilePicture: { type: String, default: '' }, // Base64 encoded
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
