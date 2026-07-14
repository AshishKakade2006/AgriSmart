import api from "./api";

export const getWeather = async (city) => {
  const response = await api.get(`/weather/${city}`);
  return response.data;
};