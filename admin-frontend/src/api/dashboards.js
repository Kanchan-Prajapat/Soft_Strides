// // src/api/dashboard.js

import API from "./api";

export const fetchDashboardStats = async () => {
  const res = await API.get("/dashboard/stats");
  return res.data;
};

export const fetchMonthlyRevenue = async () => {
  const res = await API.get("/dashboard/monthly-revenue");
  return res.data;
};
