const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    cropName: String,
    soilType: String,
    temperature: String,
    fertilizer: String,
    irrigation: String,
    season: String
});

module.exports = mongoose.model("Crop", cropSchema);