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
  const [selectedProduct, setSelectedProduct] = useState(null);
const [selectedSize, setSelectedSize] = useState("");

  const token = localStorage.getItem("userToken");
  

  /* ======================
     LOAD WISHLIST
  ====================== */


  const fetchWishlist = useCallback(async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/wishlist`,
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
        `${API_URL}/api/wishlist/${id}`,
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
      <h2>Your Curated Collection</h2>

      {!token ? (
        <p>Please login to view Collection</p>
      ) : wishlist.length === 0 ? (
        <p>No items in Collection</p>
      ) : (
       <div className="wishlist-list">
  {wishlist.map((product) => (
    <div key={product._id} className="wishlist-row">

      {/* LEFT: IMAGE */}
      <div
        className="wishlist-image-wrapper"
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
        />
      </div>

      {/* RIGHT: DETAILS */}
      <div className="wishlist-details">
        <h3
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        <p className="wishlist-price">
          ₹{product.price}
        </p>

        <div className="wishlist-actions">
           <button onClick={() => setSelectedProduct(product)}>
           Move to Cart
           </button> 

          <button
            className="remove-btn"
            onClick={() => removeFromWishlist(product._id)}
          >
            Remove
          </button>
        </div>
      </div>
      {selectedProduct && (
  <div className="size-popup">
    <div className="size-box">
      <h3>Select Size</h3>

      <div className="size-options">
        {selectedProduct.sizes?.map((size) => (
          <button
            key={size}
            className={selectedSize === size ? "active-size" : ""}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      <button
        className="confirm-btn"
        onClick={() => {
          if (!selectedSize) {
            alert("Please select size");
            return;
          }

          moveToCart({
            ...selectedProduct,
            size: selectedSize,
          });

          setSelectedProduct(null);
          setSelectedSize("");
        }}
      >
        Confirm
      </button>

      <button
        className="cancel-btn"
        onClick={() => {
          setSelectedProduct(null);
          setSelectedSize("");
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  ))}
</div>
      )}
    </div>
  );
};

export default Wishlist;