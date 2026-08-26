import { useEffect, useState } from "react";

import {
  Droplets,
  Wind,
  MapPin,
  CloudSun,
  Thermometer,
} from "lucide-react";

import { getWeather } from "../services/weatherService";
import { getProfile } from "../services/profileService";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Get the logged-in farmer's profile
      const profile = await getProfile();

      // Get the farmer's farm location
      const location = profile.data.user.farmLocation;

      // Get weather for that location
      const data = await getWeather(location);

      setWeather(data.weather);
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

  if (!weather) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-full min-h-[280px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CloudSun
              size={21}
              className="text-emerald-600"
            />
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Loading weather...
          </p>
        </div>
      </div>
    );
  }

  const temperature = Math.round(weather.main.temp);

  const description =
    weather.weather?.[0]?.description || "Current conditions";

  const humidity = weather.main.humidity;

  const windSpeed = weather.wind.speed;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full">

      {/* ================= HEADER ================= */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Farm Weather
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-1">
            Current Conditions
          </h2>

          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
            <MapPin size={15} />
            <span>{weather.name}</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
          <CloudSun
            size={22}
            className="text-sky-600"
          />
        </div>
      </div>

      {/* ================= MAIN WEATHER ================= */}
      <div className="px-6 py-6">

        <div className="flex items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-xl bg-sky-50 flex items-center justify-center">
              <Thermometer
                size={27}
                className="text-sky-600"
              />
            </div>

            <div>
              <div className="flex items-start">
                <span className="text-5xl font-semibold tracking-tight text-gray-900">
                  {temperature}
                </span>

                <span className="text-xl text-gray-500 mt-1 ml-1">
                  °C
                </span>
              </div>

              <p className="text-sm text-gray-500 capitalize mt-1">
                {description}
              </p>
            </div>

          </div>

          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400">
              Feels like
            </p>

            <p className="text-lg font-medium text-gray-700 mt-1">
              {Math.round(weather.main.feels_like)}°C
            </p>
          </div>

        </div>

        {/* ================= DETAILS ================= */}
        <div className="grid grid-cols-2 gap-3 mt-7">

          {/* Humidity */}
          <div className="bg-gray-50 rounded-lg px-4 py-3.5">
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                <Droplets
                  size={16}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Humidity
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {humidity}%
                </p>
              </div>

            </div>
          </div>

          {/* Wind */}
          <div className="bg-gray-50 rounded-lg px-4 py-3.5">
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center">
                <Wind
                  size={16}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Wind
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {windSpeed} m/s
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WeatherCard;