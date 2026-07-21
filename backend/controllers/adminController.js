const User = require("../models/User");
const Chat = require("../models/Chat");
const Crop = require("../models/Crop");

// Mock logs for demonstration
const mockSystemLogs = [
    { id: 1, type: 'info', message: 'System boot successful', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, type: 'warn', message: 'High memory usage detected', timestamp: new Date(Date.now() - 43200000).toISOString() },
    { id: 3, type: 'error', message: 'Failed to sync with openweather API', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const mockWeatherLogs = [
    { id: 1, location: 'Tiruchirappalli', temp: 34, condition: 'Clear', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 2, location: 'Chennai', temp: 31, condition: 'Clouds', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalChats = await Chat.countDocuments();
        const totalCrops = await Crop.countDocuments();

        res.json({
            users: totalUsers,
            chats: totalChats,
            crops: totalCrops,
            systemLogs: mockSystemLogs,
            weatherLogs: mockWeatherLogs
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        await Chat.deleteMany({ userId: id });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chats" });
    }
};
