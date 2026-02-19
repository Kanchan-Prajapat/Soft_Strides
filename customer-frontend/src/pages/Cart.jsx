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
        <h2>Your Premium Selection is Empty</h2>
        <Link to="/products" className="Continue-shop">
          Continue Shopping
        </Link>
      </div>
    );
  }

   return (
  <div className="container cart-page">
    <h2 className="cart-title">Your Premium Selection</h2>

    <div className="cart-layout">

      {/* LEFT SIDE - PRODUCTS */}
      <div className="cart-items">

        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">

            <div className="cart-left">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="cart-image"
                onClick={() => navigate(`/product/${item._id}`)}
              />
            </div>

            <div className="cart-right">

              <h3 onClick={() => navigate(`/product/${item._id}`)}>
                {item.name}
              </h3>

              {/* ✅ Description from backend */}
              <p className="cart-desc">
                {item.description}
              </p>

              <p className="cart-price">₹{item.price}</p>

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

      </div>

      {/* RIGHT SIDE - SUMMARY */}
      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>

        <Link to="/checkout" className="checkout-btn">
          Proceed to Checkout
        </Link>
      </div>

    </div>
  </div>
);

};

export default Cart;