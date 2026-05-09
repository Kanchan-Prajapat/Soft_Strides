import "./OrderModal.css";
import { verifyPayment, rejectPayment} from "../api/orders";
import TrackingTimeline from "./TrackingTimeline";
import { useEffect, useState } from "react";
import API from "../api/api";

const OrderModal = ({ order, onClose, onStatusUpdate }) => {

  const [updatedOrder, setUpdatedOrder] = useState(order);

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

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await API.get(`/orders/track/${order._id}`);
        setUpdatedOrder(res.data); // 🔥 IMPORTANT
      } catch (err) {
        console.log(err);
      }
    };

    if (order?._id) fetchTracking();
  }, [order]);

  return (
    <div className="modal-overlay">
      <div className="modal-box">

      <div className="order-modal-container">

  {/* LEFT SIDE - DETAILS */}
  <div className="order-modal-left">
    <h2>Order Details</h2>

    <p><strong>Customer:</strong> {order.user?.name}</p>
    <p><strong>Email:</strong> {order.user?.email}</p>
   <p><strong>Phone:</strong> {order.phone}</p>
<p><strong>Address:</strong> {order.address}</p>
    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
    <p><strong>Status:</strong> {order.paymentStatus}</p>
 <p><strong>Tracking ID:</strong> {updatedOrder.trackingId}</p>
            <p><strong>AWB:</strong> {updatedOrder.awbCode || "Generating..."}</p>

    <h3 style={{ marginTop: 20 }}>Products</h3>

    {order.products?.map((item, index) => (
      <div key={index} className="modal-product-info">
        <strong>{item.name}</strong>
        <div>Size: {item.size}</div>
      <div>Qty: {item.qty}</div>
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

        {/* <div className="order-section">
          <h4>Payment Screenshot</h4>
          <div className="payment-image-wrapper">
            <img
              src={order.paymentScreenshot}
              alt="Payment"
              onClick={() => window.open(order.paymentScreenshot)}
            />
          </div>
        </div> */}

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

          
   <h4 style={{ marginTop: 20 }}>Order Timeline</h4>

        {/* ✅ UPDATED */}
        <TrackingTimeline history={updatedOrder.history || []} />


         
        </div>
         <button className="close" onClick={onClose}>
            Close
          </button>
      </div>
    </div>
  );
};

export default OrderModal;
