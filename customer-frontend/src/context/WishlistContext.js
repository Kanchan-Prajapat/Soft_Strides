import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("userToken");
   const API_URL = process.env.REACT_APP_API_URL;
  // Load wishlist from DB
  useEffect(() => {
    const loadWishlist = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          `${API_URL}/api/wishlist`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setWishlist(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadWishlist();
  }, [token, API_URL],);

  const addToWishlist = async (product) => {
    if (!token) return alert("Please login");

    try {
      await axios.post(
        `${API_URL}/api/wishlist/${product._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlist((prev) => [...prev, product]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/wishlist/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
