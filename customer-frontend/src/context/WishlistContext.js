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
  }, [token, API_URL]);

  // TOGGLE WISHLIST
  const toggleWishlist = async (product) => {
  if (!token) {
    alert("Please login");
    return;
  }

  try {
    const res = await axios.post(
      `${API_URL}/api/wishlist/${product._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Backend returns updated wishlist array
    setWishlist(res.data);

  } catch (error) {
    console.log(error);
  }
};

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