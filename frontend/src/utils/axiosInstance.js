import axios from "axios";

// Create a centralized axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the correct token for the current role
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token of the current role
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
