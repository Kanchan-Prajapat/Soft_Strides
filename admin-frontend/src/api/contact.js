import API from "./api";

export const getMessages = () => API.get("/contact");

export const deleteMessage = (id) =>
  API.delete(`/contact/${id}`);