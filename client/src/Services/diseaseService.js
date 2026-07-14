import api from "./api";

export const detectDisease = async (formData) => {
  return await api.post("/disease/detect", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};