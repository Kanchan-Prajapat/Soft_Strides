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

      <div className="order-modal-container">

  {/* LEFT SIDE - DETAILS */}
  <div className="order-modal-left">
    <h2>Order Details</h2>

    <p><strong>Customer:</strong> {order.user?.name}</p>
    <p><strong>Email:</strong> {order.user?.email}</p>
    <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>
    <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
    <p><strong>Status:</strong> {order.paymentStatus}</p>

    <h3 style={{ marginTop: 20 }}>Products</h3>

    {order.products?.map((item, index) => (
      <div key={index} className="modal-product-info">
        <strong>{item.name}</strong>
        <div>Size: {item.size}</div>
        <div>Qty: {item.quantity}</div>
      </div>
    ))}
  </div>


  {/* RIGHT SIDE - IMAGE */}
  <div className="order-modal-right">
    {order.products?.[0]?.image && (
      <img
        src={order.products[0].image}
        alt={order.products[0].name}
        className="modal-product-image"
      />
    )}
  </div>

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
