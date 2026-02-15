import API from "./api";

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/users/profile", data);
  return res.data;
};


export const changePassword = async (data) => {
  const res = await API.put("/users/change-password", data);
  return res.data;
};
