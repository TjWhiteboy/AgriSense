const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather?district=<name>
router.get('/weather', weatherController.getWeather);

// GET /api/weather/reverse-geocode?lat=<lat>&lon=<lon>
router.get('/weather/reverse-geocode', weatherController.reverseGeocode);

module.exports = router;
