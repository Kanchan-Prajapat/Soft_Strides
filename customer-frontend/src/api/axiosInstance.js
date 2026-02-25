import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;