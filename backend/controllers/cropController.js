const Crop = require("../models/Crop");

// GET /api/crops
exports.getAllCrops = async (req, res) => {
    try {
        const crops = await Crop.find({});
        res.json(crops);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch crops", details: error.message });
    }
};

// POST /api/crops
exports.createCrop = async (req, res) => {
    try {
        const { cropName, soilType, temperature, fertilizer, irrigation, season } = req.body;
        
        if (!cropName) {
            return res.status(400).json({ error: "Crop name is required." });
        }

        const newCrop = new Crop({ cropName, soilType, temperature, fertilizer, irrigation, season });
        await newCrop.save();
        
        res.status(201).json(newCrop);
    } catch (error) {
        res.status(500).json({ error: "Failed to create crop", details: error.message });
    }
};

// PUT /api/crops/:id
exports.updateCrop = async (req, res) => {
    try {
        const { cropName, soilType, temperature, fertilizer, irrigation, season } = req.body;
        
        const updatedCrop = await Crop.findByIdAndUpdate(
            req.params.id,
            { cropName, soilType, temperature, fertilizer, irrigation, season },
            { new: true, runValidators: true }
        );

        if (!updatedCrop) {
            return res.status(404).json({ error: "Crop not found" });
        }
        
        res.json(updatedCrop);
    } catch (error) {
        res.status(500).json({ error: "Failed to update crop", details: error.message });
    }
};

// DELETE /api/crops/:id
exports.deleteCrop = async (req, res) => {
    try {
        const deletedCrop = await Crop.findByIdAndDelete(req.params.id);
        
        if (!deletedCrop) {
            return res.status(404).json({ error: "Crop not found" });
        }
        
        res.json({ message: "Crop deleted successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete crop", details: error.message });
    }
};
