import api from "./api";

export const createCrop = (cropData) => {
  return api.post("/crops", cropData);
};

export const getMyCrops = () => {
  return api.get("/crops");
};

export const getCropById = (id) => {
  return api.get(`/crops/${id}`);
};

export const updateCrop = (id, cropData) => {
  return api.put(`/crops/${id}`, cropData);
};

export const deleteCrop = (id) => {
  return api.delete(`/crops/${id}`);
};
export const getDashboardStats = () => {
  return api.get("/crops/stats");
};
export const getUpcomingHarvests = () => {
  return api.get("/crops/upcoming");
};