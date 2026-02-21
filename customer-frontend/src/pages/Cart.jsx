import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
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
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="cart-item"
              >
                {/* IMAGE */}
                <div className="cart-left">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                  />
                </div>

                {/* DETAILS */}
                <div className="cart-right">
                  <h3>{item.name}</h3>

                  {/* SIZE */}
                  <p className="cart-desc">
                    Size: <strong>{item.size}</strong>
                  </p>

                  <p className="cart-price">
                    ₹{item.price}
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
            <h3>Total: ₹{totalPrice}</h3>

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