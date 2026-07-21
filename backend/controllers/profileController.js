const User = require("../models/User");
const Chat = require("../models/Chat");
const bcrypt = require("bcryptjs");

// GET /api/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile", details: error.message });
    }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, state, district, preferredCrop, language, profilePicture } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Name is required." });
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, state, district, preferredCrop, language, profilePicture },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updated) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Profile updated successfully", user: updated });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
};

// PUT /api/profile/password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new password are required." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters." });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect." });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to change password", details: error.message });
    }
};

// DELETE /api/profile
exports.deleteAccount = async (req, res) => {
    try {
        // Delete all user chats first
        await Chat.deleteMany({ userId: req.user.id });
        // Delete user
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "Account deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete account", details: error.message });
    }
};
