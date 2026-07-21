import { useEffect, useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";
import { getWeather } from "../services/weatherService";
import { getMyCrops } from "../services/cropService";
import { useAuth } from "../context/authContext";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Pune"); // Default fallback
  const { user } = useAuth();

  useEffect(() => {
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  const fetchUserLocation = async () => {
    try {
      // Try to get user's crops to find their location
      const response = await getMyCrops();
      
      if (response.data?.crops && response.data.crops.length > 0) {
        // Get location from the first crop
        const userLocation = response.data.crops[0].location;
        setLocation(userLocation);
      } else {
        // Fallback to Pune if no crops found
        setLocation("Pune");
      }
    } catch (error) {
      console.log("Error fetching user location:", error);
      // Use default if fetch fails
      setLocation("Pune");
    }
  };

  const fetchWeather = async () => {
    try {
      const data = await getWeather(location);
      setWeather(data.weather);
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

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