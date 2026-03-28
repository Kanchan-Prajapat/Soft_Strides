import api from "./axiosInstance";

export const sendMessage = (data) => {
  return api.post("/api/contact", data);
};