import api from "./api";


// Detect plant disease
export const detectDisease = async (formData) => {
  return await api.post("/disease/detect", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// Get disease detection history
export const getDiseaseHistory = async () => {
  return await api.get("/disease/history");
};