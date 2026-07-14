const axios = require("axios");

const getWeather = async (req, res) => {
  try {
    const { city } = req.params;

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }
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