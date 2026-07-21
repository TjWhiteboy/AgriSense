const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// GET /api/market — no auth required (public)
router.get('/market', marketController.getMarketPrices);

module.exports = router;
