import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/products.css";
import axios from "axios";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const API_URL = process.env.REACT_APP_API_URL;
  const isWishlisted = isInWishlist(product._id);

  /* ========================
     WISHLIST
  ======================== */
  const handleWishlist = async (e) => {
    e.stopPropagation(); // stop card click

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/users/wishlist/${product._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toggleWishlist(product._id); // update UI instantly
    } catch (err) {
      console.log(err);
    }
  };

  /* ========================
     BUY NOW
  ======================== */
  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart({ ...product, qty: 1 });
    navigate("/checkout");
  };

  /* ========================
     ADD TO CART
  ======================== */
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...product, qty: 1 });
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* ❤️ Wishlist */}
      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={handleWishlist}
      >
        ❤
      </button>

      {/* Image */}
      <div className="product-image-wrapper">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="product-image"
        />
      </div>

      {/* Info */}
      <div className="product-info">
        <h4>{product.name}</h4>

        <div className="rating">⭐⭐⭐⭐☆</div>

        <p className="price">₹{product.price}</p>

        <div className="size-badges">
          {product.sizes?.map((size, i) => (
            <span key={i}>{size}</span>
          ))}
        </div>

        <div className="btn-group">
          <button onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button className="buy-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;