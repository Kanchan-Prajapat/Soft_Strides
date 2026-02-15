//api/orders.js
import API from "./api";

export const fetchOrders = async (type = "") => {
  const res = await API.get(`/orders${type ? `?type=${type}` : ""}`);
  return res.data;
};

export const verifyPayment = async (id) => {
  const res = await API.put(`/orders/payment/${id}`, {
    status: "Verified",
  });
  return res.data;
};

export const rejectPayment = async (id) => {
  const res = await API.put(`/orders/payment/${id}`, {
    status: "Rejected",
  });
  return res.data;
};

export const updateDelivery = async (id, status) => {
  const res = await API.put(`/orders/delivery/${id}`, {
    status,
  });
  return res.data;
};

export const approveReturn = async (id) => {
  const res = await API.put(`/orders/return/approve/${id}`);
  return res.data;
};

export const rejectReturn = async (id) => {
  const res = await API.put(`/orders/return/reject/${id}`);
  return res.data;
};
