import API from "./api";

export const getFlashSalesAdmin = async () => {
  const res = await API.get("/flash-sales/admin");
  return res.data;
};

export const createFlashSale = async (data) => {
  const res = await API.post("/flash-sales", data);
  return res.data;
};

export const deleteFlashSale = async (id) => {
  const res = await API.delete(`/flash-sales/${id}`);
  return res.data;
};
