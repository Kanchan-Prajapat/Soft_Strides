import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import "../styles/products.css";

const ProductCard = ({ product, discountedPrice }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isInCart = cartItems.some(item => item._id === product._id);
  const isWishlisted = isInWishlist(product._id);

  // 🔥 SIZE STATE (MISSING THA)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Free Size");
  const hasSizes = product.sizes && product.sizes.length > 0;

  /* ========================
     WISHLIST
  ======================== */
  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  /* ========================
     BUY NOW
  ======================== */
  const handleBuyNow = (e) => {
    e.stopPropagation();

    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    addToCart({ ...product, size: selectedSize, qty: 1 });
    navigate("/checkout");
  };

  /* ========================
     ADD TO CART
  ======================== */
  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (!selectedSize) {
      alert("Please select size");
      return;
    }

    addToCart({ ...product, size: selectedSize, qty: 1 });
    alert("Added to Cart 🛒");
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
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* IMAGE */}
      <div className="product-image-wrapper">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="product-image"
        />
      </div>

      {/* INFO */}
      <div className="product-info">

        {/* 🔥 NAME + PRICE SAME ROW */}
        <div className="product-info-top">
          <h4>{product.name}</h4>

          {discountedPrice ? (
            <div className="flash-price">
              <span className="old-price">₹{product.price}</span>
              <span className="new-price">₹{discountedPrice}</span>
            </div>
          ) : (
            <p className="price">₹{product.price}</p>
          )}
        </div>

        {/* 🔥 SIZES */}
        <div className="size-badges">
          {hasSizes ? (
            product.sizes.map((size, i) => (
              <span
                key={i}
                className={selectedSize === size ? "active-size" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
              >
                {size}
              </span>
            ))
          ) : (
            <span className="free-size active-size">Free Size</span>
          )}
        </div>

        {/* 🔥 BUTTONS */}
        <div className="btn-group">
          {isInCart ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/cart");
              }}
            >
              View Cart
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(e);
              }}
            >
              Add to Cart
            </button>
          )}

          <button
            className="buy-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleBuyNow(e);
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;