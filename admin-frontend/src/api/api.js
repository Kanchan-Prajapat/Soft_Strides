// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://softstrides-backend.onrender.com"|| "http://localhost:5000",
});

/* 🔐 REQUEST INTERCEPTOR */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* 🚨 RESPONSE INTERCEPTOR (ADD HERE) */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default API;
