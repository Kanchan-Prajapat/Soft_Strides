import API from "./api";

export const fetchProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await API.post("/products", formData);
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await API.put(`/products/${id}`, formData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};
