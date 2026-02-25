import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  /* ======================
     LOAD WISHLIST
  ====================== */
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const res = await api.get("/api/wishlist");
        setWishlist(res.data || []);
      } catch (error) {
        console.log("Wishlist load error:", error);
      }
    };

    const token = localStorage.getItem("userToken");
    if (token) {
      loadWishlist();
    }
  }, []);

  /* ======================
     TOGGLE WISHLIST
  ====================== */
  const toggleWishlist = async (product) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please login");
      return;
    }

    try {
      const res = await api.post(
        `/api/wishlist/${product._id}`
      );

      setWishlist(res.data || []);
    } catch (error) {
      console.log("Toggle error:", error);
    }
  };

  /* ======================
     CHECK IF IN WISHLIST
  ====================== */
  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => item._id?.toString() === id.toString()
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);