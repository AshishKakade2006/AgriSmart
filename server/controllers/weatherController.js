const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    // Support either ?city=CityName OR ?lat=..&lon=..
    const { city } = req.query;
    const { lat, lon } = req.query;

    const params = {
      appid: process.env.WEATHER_API_KEY,
      units: "metric",
    };

    if (city) {
      params.q = city;
    } else if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      // default fallback
      params.q = "Pune";
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params }
    );

    res.status(200).json({
      success: true,
      weather: response.data,
    });
  } catch (error) {
    console.error("Weather Error:");
    console.error(error.response?.data);
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch weather",
    });
  }
};

module.exports = {
  getWeather,
};