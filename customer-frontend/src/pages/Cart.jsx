import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem
  } = useCart();

  const cartTotal = cartItems.reduce(
  (acc, item) =>
    acc +
    Number(item.discountPrice || 0) *
    Number(item.qty || 1),
  0
);

  const navigate = useNavigate();

  return (
    <div className="container cart-page">
      <h2 className="cart-title">
        Your Premium Selection
      </h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-layout">
          {/* LEFT SIDE */}
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div
              key={`${item._id}-${item.size}-${index}`}
                className="cart-item"
              >
                {/* IMAGE */}
                <div className="cart-left">
                  <div className="premium-image-wrapper" style={{ width: 140 }}>
                    <img src={item.images?.[0]} alt={item.name} className="premium-image" />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="cart-right">
                  <h3>{item.name}</h3>

                  {/* SIZE */}
                  <p className="cart-desc">
                    Size: <strong>{item.size}</strong>
                  </p>

                  <p className="cart-price">
                    ₹{item.discountPrice}
                  </p>

                  {/* QTY */}
                  <div className="qty-controls">
                    <button
                      onClick={() =>
                        decreaseQty(item._id, item.size)
                      }
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        increaseQty(item._id, item.size)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item._id, item.size)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h3>Total: ₹{cartTotal}</h3>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;