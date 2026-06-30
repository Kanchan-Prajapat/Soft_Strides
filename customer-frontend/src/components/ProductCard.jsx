import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/products.css";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

const ProductCard = ({ product, openCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();

  const isWishlisted = isInWishlist(product._id);
  const [currentImage, setCurrentImage] = useState(0);

  const isAdded = cartItems.some(
    (item) => item._id === product._id
  );


  /* ========================
     WISHLIST
  ======================== */
  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };



const handlers = useSwipeable({
  onSwipedLeft: () => {
    if (window.innerWidth > 768) return;

    setCurrentImage((prev) =>
      prev === product.images.length - 1
        ? 0
        : prev + 1
    );
  },

  onSwipedRight: () => {
    if (window.innerWidth > 768) return;

    setCurrentImage((prev) =>
      prev === 0
        ? product.images.length - 1
        : prev - 1
    );
  },

  preventScrollOnSwipe: true,
  trackMouse: false,
});


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

      {/* 🔥 Discount */}
      {product.originalPrice > product.discountPrice && (
        <div className="minimal-discount-badge">
          {Math.round(
            ((product.originalPrice - product.discountPrice) /
              product.originalPrice) *
            100
          )}
          % off
        </div>
      )}

      {/* IMAGE */}
      <div>
       {/* IMAGE */}
<div
  className="premium-image-wrapper"
  {...handlers}
>
  <img
    src={product.images?.[currentImage] || "/placeholder.png"}
    alt={product.name}
    className="premium-image"
  />

  {/* Image Counter */}
  <div
    className="image-counter"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="counter-btn"
      onClick={(e) => {
        e.stopPropagation();
        setCurrentImage((prev) =>
          prev === 0
            ? product.images.length - 1
            : prev - 1
        );
      }}
    >
      ‹
    </button>

    <span>
      {currentImage + 1}/{product.images.length}
    </span>

    <button
      className="counter-btn"
      onClick={(e) => {
        e.stopPropagation();
        setCurrentImage((prev) =>
          prev === product.images.length - 1
            ? 0
            : prev + 1
        );
      }}
    >
      ›
    </button>
  </div>
</div>
     

      </div>

      {/* INFO */}
      <div className="product-info">

        <div className="product-bottom">

          <div className="product-text">
            <h4>{product.name}</h4>

            <div className="flash-price">
              <span className="new-price">
                ₹{product.discountPrice}
              </span>

              {product.originalPrice > product.discountPrice && (
                <span className="old-price">
                  ₹{product.originalPrice}
                </span>
              )}

              <button
                className={`add-icon-btn ${isAdded ? "added" : ""}`}

                onClick={(e) => {
                  e.stopPropagation();

                  addToCart({
                    ...product,
                    size: product.sizes?.[0] || "Free Size",
                    qty: 1,
                  });

                  openCart();
                }}
              >
                {isAdded ? "✓" : "+"}
              </button>


            </div>
          </div>


        </div>

      </div>

    </div>
  );
};

export default ProductCard;