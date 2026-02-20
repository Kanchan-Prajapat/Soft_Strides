import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/products.css";

const ProductCard = ({ product, discountedPrice }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
 const { toggleWishlist, isInWishlist } = useWishlist();

 const isWishlisted = isInWishlist(product._id);

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
    addToCart({ ...product, qty: 1 });
    navigate("/checkout");
  };

  /* ========================
     ADD TO CART
  ======================== */
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...product, qty: 1 });
    alert("Added to Cart 🛒");
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* ❤️ Wishlist Button */}
   
<button
  className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
  onClick={handleWishlist}
>
  {isWishlisted ? "❤️" : "🤍"}
</button>

      {/* Product Image */}
      <div className="product-image-wrapper">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="product-image"
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h4>{product.name}</h4>

        <div className="rating">⭐⭐⭐⭐☆</div>

        {discountedPrice ? (
          <div className="flash-price">
            <span className="old-price">₹{product.price}</span>
            <span className="new-price">₹{discountedPrice}</span>
          </div>
        ) : (
          <p className="price">₹{product.price}</p>
        )}

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