import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem("userToken");

  /* ======================
     LOAD WISHLIST
  ====================== */


  const fetchWishlist = useCallback(async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/users/wishlist`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setWishlist(res.data || []);
  } catch (error) {
    console.log(error);
  }
}, [API_URL, token]);

 useEffect(() => {
  if (token) {
    fetchWishlist();
  }
}, [token, fetchWishlist]);

  /* ======================
     REMOVE
  ====================== */
  const removeFromWishlist = async (id) => {
    try {
      await axios.post(
        `${API_URL}/api/users/wishlist/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // remove instantly from UI
      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* ======================
     MOVE TO CART
  ====================== */
  const moveToCart = async (product) => {
    addToCart({ ...product, qty: 1 });
    removeFromWishlist(product._id);
  };

  return (
    <div className="container wishlist-page">
      <h2>My Wishlist</h2>

      {!token ? (
        <p>Please login to view wishlist</p>
      ) : wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-item">

              <img
                src={product.images?.[0]}
                alt={product.name}
                className="wishlist-image"
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              />

              <h4
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >
                {product.name}
              </h4>

              <p className="wishlist-price">
                ₹{product.price}
              </p>

              <div className="wishlist-buttons">
                <button onClick={() => moveToCart(product)}>
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;