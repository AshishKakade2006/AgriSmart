const express = require("express");
const router = express.Router();

const { getWeather } = require("../controllers/weatherController");

// Accept either ?city=CityName or ?lat=..&lon=..
router.get("/", getWeather);

module.exports = router;