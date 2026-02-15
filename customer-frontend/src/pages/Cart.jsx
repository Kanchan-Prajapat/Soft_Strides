import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h2>Your Cart is Empty</h2>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div key={item._id} className="cart-item">

          {/* ✅ IMAGE CLICK NAVIGATION */}
          <img
            src={item.images?.[0] || "https://via.placeholder.com/120"}
            alt={item.name}
            className="cart-image"
            onClick={() => navigate(`/product/${item._id}`)}
            style={{ cursor: "pointer" }}
          />

          <div className="cart-details">
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              {item.name}
            </h3>

            <p>Size: {item.size}</p>
            <p>₹{item.price}</p>

            <div className="qty-controls">
              <button onClick={() => decreaseQty(item._id)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(item._id)}>+</button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeItem(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>
        <Link to="/checkout" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;