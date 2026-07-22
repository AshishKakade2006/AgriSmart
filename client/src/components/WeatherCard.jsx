import { useEffect, useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";
import { getWeather } from "../services/weatherService";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Try browser geolocation first for accurate local weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const data = await getWeather({ lat: latitude, lon: longitude });
            setWeather(data.weather);
          } catch (error) {
            console.error("Error fetching weather by coords:", error);
          }
        },
        // on error or denial fallback to a default city
        async () => {
          try {
            const data = await getWeather({ city: "Pune" });
            setWeather(data.weather);
          } catch (error) {
            console.error("Error fetching default weather:", error);
          }
        }
      );
    } else {
      // Geolocation unsupported — fallback
      (async () => {
        try {
          const data = await getWeather({ city: "Pune" });
          setWeather(data.weather);
        } catch (error) {
          console.error("Error fetching default weather:", error);
        }
      })();
    }
  }, []);

  if (!weather) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        Loading weather...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        🌤 Weather
      </h2>

      <p className="text-lg">
        {weather.name}
      </p>

      <h1 className="text-5xl font-bold mt-2">
        {weather.main.temp}°C
      </h1>

      <p className="capitalize mt-2">
        {weather.weather[0].description}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="flex items-center gap-2">
          <Droplets />
          <span>{weather.main.humidity}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Wind />
          <span>{weather.wind.speed} m/s</span>
        </div>

      </div>

    </div>
  );
};

export default WeatherCard;