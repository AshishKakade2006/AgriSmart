import api from "./api";

// getWeather accepts either { city } or { lat, lon }
export const getWeather = async (params) => {
  if (typeof params === "string") {
    params = { city: params };
  }

  const query = {};

  if (params.city) query.city = params.city;
  if (params.lat) query.lat = params.lat;
  if (params.lon) query.lon = params.lon;

  const response = await api.get(`/weather`, { params: query });
  return response.data;
};
