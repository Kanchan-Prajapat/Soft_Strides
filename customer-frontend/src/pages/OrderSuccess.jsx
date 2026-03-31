import { useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-wrapper">
      <div className="success-card">
        
        {/* ICON */}
        <div className="success-icon">🎉</div>

        {/* TITLE */}
        <h1>Order Placed Successfully</h1>
        <p>Your order has been confirmed and will be shipped soon.</p>

        {/* BUTTONS */}
        <div className="success-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/profile")}
          >
            View My Orders
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;