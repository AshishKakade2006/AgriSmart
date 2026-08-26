import { useEffect, useState } from "react";

import {
  Droplets,
  Wind,
  MapPin,
  CloudSun,
  Thermometer,
  Sprout,
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
      const profile = await getProfile();

      const location = profile.data.user.farmLocation;

      const data = await getWeather(location);

      setWeather(data.weather);
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

  if (!weather) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center mx-auto">
            <CloudSun
              size={25}
              className="text-sky-500"
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
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;

  const description =
    weather.weather?.[0]?.description || "Current conditions";

  /*
   * Simple farming condition indicator.
   * This uses information we already receive from the API.
   */
  const getFarmCondition = () => {
    if (temperature >= 38 || humidity >= 85) {
      return {
        label: "Keep an eye on crops",
        text: "Warm and humid conditions",
      };
    }

    if (temperature >= 25 && temperature <= 35 && humidity >= 40 && humidity <= 75) {
      return {
        label: "Favorable conditions",
        text: "Weather looks suitable for crops",
      };
    }

    return {
      label: "Monitor conditions",
      text: "Weather may need some attention",
    };
  };

  const farmCondition = getFarmCondition();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">

      {/* =====================================================
          TOP WEATHER AREA
      ===================================================== */}

      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-7">

        {/* Decorative circles */}
        <div className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-white/10" />

        <div className="absolute right-20 -bottom-16 w-32 h-32 rounded-full bg-white/10" />

        <div className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full bg-white/5 blur-xl" />


        {/* Header */}
        <div className="relative flex items-start justify-between">

          <div>
            <p className="text-sm font-medium text-sky-100">
              Farm Weather
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              Current Conditions
            </h2>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-sky-100">
              <MapPin size={15} />

              <span>
                {weather.name}
              </span>
            </div>
          </div>


          {/* Weather Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <CloudSun
              size={27}
              className="text-white"
            />
          </div>

        </div>


        {/* Main temperature */}
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between mt-8">

          <div className="flex items-center">

            <span className="text-6xl sm:text-7xl font-semibold tracking-tight">
              {temperature}
            </span>

            <span className="text-2xl text-sky-100 self-start mt-2 ml-1">
              °C
            </span>

          </div>


          <div className="mt-4 sm:mt-0 sm:text-right">

            <p className="text-sm text-sky-100">
              {description}
            </p>

            <p className="text-sm text-white/90 mt-1">
              Feels like{" "}
              <span className="font-semibold">
                {feelsLike}°C
              </span>
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          WEATHER DETAILS
      ===================================================== */}

      <div className="px-6 sm:px-8 py-5">

        <div className="grid grid-cols-2 gap-4">

          {/* Humidity */}
          <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Droplets
                  size={19}
                  className="text-sky-500"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Humidity
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-0.5">
                  {humidity}%
                </p>
              </div>

            </div>

          </div>


          {/* Wind */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Wind
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Wind Speed
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-0.5">
                  {windSpeed} m/s
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FARM CONDITION
        ================================================= */}

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Sprout
                size={18}
                className="text-emerald-600"
              />
            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between gap-3">

                <p className="text-sm font-medium text-gray-800">
                  Farm Conditions
                </p>

                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {farmCondition.label}
                </span>

              </div>

              <p className="text-xs text-gray-500 mt-1">
                {farmCondition.text}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default WeatherCard;