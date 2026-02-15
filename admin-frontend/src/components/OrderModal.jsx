import "./OrderModal.css";
import { verifyPayment, rejectPayment } from "../api/orders";

const OrderModal = ({ order, onClose, onStatusUpdate }) => {
  const handleVerify = async () => {
    await verifyPayment(order._id);
    onStatusUpdate();
    onClose();
  };

  const handleReject = async () => {
    await rejectPayment(order._id);
    onStatusUpdate();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Order Details</h2>

        <div className="order-section">
          <p><b>Customer:</b> {order.user?.name}</p>
          <p><b>Email:</b> {order.user?.email}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.address}</p>
          <p><b>Total:</b> ₹{order.totalAmount}</p>
          <p><b>Status:</b> {order.paymentStatus}</p>
        </div>

        <div className="order-section">
          <h4>Products</h4>
          {order.products.map((p, i) => (
            <div key={i} className="order-product">
              <p><b>{p.product?.name}</b></p>
              <p>Size: {p.size}</p>
              <p>Quantity: {p.quantity}</p>
            </div>
          ))}
        </div>

        <div className="order-section">
          <h4>Payment Screenshot</h4>
          <div className="payment-image-wrapper">
            <img
              src={order.paymentScreenshot}
              alt="Payment"
              onClick={() => window.open(order.paymentScreenshot)}
            />
          </div>
        </div>

        <div className="modal-actions">
          {order.paymentStatus === "Pending" && (
            <>
              <button className="verify" onClick={handleVerify}>
                Verify Payment
              </button>
              <button className="reject" onClick={handleReject}>
                Reject Payment
              </button>
            </>
          )}

          <button className="close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
