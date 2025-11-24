// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated, token missing");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
