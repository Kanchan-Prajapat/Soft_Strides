import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/products.css";

const ProductCard = ({ product,  openCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();

  const isWishlisted = isInWishlist(product._id);

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
    <div className="premium-image-wrapper">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="premium-image"
      />
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