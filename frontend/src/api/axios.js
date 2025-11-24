// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally, handle response errors globally here (without React hooks)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // You can handle unauthorized errors here if you want,
      // but cannot do navigation here. Instead, throw error,
      // and handle it in your React components.
    }
    return Promise.reject(error);
  }
);

export default api;
