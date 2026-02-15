import API from "./api";

export const fetchPayments = async () => {
  const res = await API.get("/payments");
  return res.data;
};

export const verifyPayment = async (id) => {
  const res = await API.put(`/payments/${id}/verify`);
  return res.data;
};

export const rejectPayment = async (id) => {
  const res = await API.put(`/payments/${id}/reject`);
  return res.data;
};
