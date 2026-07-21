const express = require("express");
const router = express.Router();
const cropController = require("../controllers/cropController");
const authMiddleware = require("../middleware/authMiddleware");

// Crop management routes (protected by authMiddleware)
router.get("/crops", authMiddleware, cropController.getAllCrops);
router.post("/crops", authMiddleware, cropController.createCrop);
router.put("/crops/:id", authMiddleware, cropController.updateCrop);
router.delete("/crops/:id", authMiddleware, cropController.deleteCrop);

module.exports = router;
