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

export const toggleProductVisibility = async (id) => {
  const res = await API.put(`/products/${id}/visibility`);
  return res.data;
};

export const fetchFeaturedProducts = async () => {
  const res = await API.get("/products/featured");
  return res.data;
};

export const updateProductPriority = async (
  id,
  featuredPriority
) => {
  const res = await API.put(
    `/products/${id}/priority`,
    {
      featuredPriority,
    }
  );

  return res.data;
};

export const reorderFeaturedProducts = async (
  products
) => {
  const res = await API.put(
    "/products/reorder",
    {
      products,
    }
  );

  return res.data;
};