import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("userToken", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
  };
  useEffect(() => {
  const token = localStorage.getItem("userToken");
  if (!token) return;

  // optional: validate token
}, []);

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// ✅ THIS IS WHAT YOU ARE MISSING
export const useAuth = () => {
  return useContext(AuthContext);
};
