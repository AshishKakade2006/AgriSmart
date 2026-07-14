import axios from "axios";

const api = axios.create({
  baseURL: "https://agrismart-backend-kfzb.onrender.com/api",
  withCredentials: false,
});

export default api;