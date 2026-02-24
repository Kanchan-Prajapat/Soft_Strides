import API from "./api";

export const fetchCustomers = async (search = "") => {
  const res = await API.get(`/users/customers?search=${search}`);
  return res.data;
};

export const fetchCustomerOrders = async (id) => {
  const res = await API.get(`/users/customers/${id}/orders`);
  return res.data;
};

export const blockCustomer = async (id) => {
  const res = await API.patch(`/users/customers/${id}/block`);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await API.delete(`/users/customers/${id}`);
  return res.data;
};