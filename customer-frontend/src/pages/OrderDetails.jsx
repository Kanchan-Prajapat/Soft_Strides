import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/orderDetails.css";
import api from "../api/api"; // ✅ use interceptor

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
const navigate = useNavigate();
  /* =========================
     ✅ CLEAN STATUS LOGIC
  ========================= */

  const isCancelable = ["Pending"].includes(order?.deliveryStatus);

  const isReturnInProgress = [
    "Return Requested",
    "Return Approved",
    "Pickup Scheduled",
    "Picked Up",
  ].includes(order?.deliveryStatus);

  const isCompleted = [
    "Cancelled",
    "Refund Completed",
  ].includes(order?.deliveryStatus);

  const isReturnable = (() => {
    if (order?.deliveryStatus !== "Delivered") return false;

    const deliveredStep = order.history?.find(
      (h) => h.status === "Delivered"
    );

    if (!deliveredStep) return false;

    const deliveredDate = new Date(deliveredStep.date);
    const now = new Date();

    const diffDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  })();

  /* =========================
     📦 FETCH ORDER
  ========================= */

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) return <p className="loading">Loading...</p>;

  /* =========================
     ❌ CANCEL HANDLER
  ========================= */

  const handleCancel = async () => {
    try {
      const reason = prompt("Enter cancellation reason:");

      if (!reason) {
        alert("Reason required");
        return;
      }

      await api.put(`/orders/cancel/${order._id}`, { reason });

      alert("Order cancelled");

      // 🔥 update without reload
      setOrder((prev) => ({
        ...prev,
        deliveryStatus: "Cancelled",
        history: [
          ...(prev.history || []),
          {
            status: "Cancelled",
            date: new Date(),
          },
        ],
      }));
    } catch (err) {
      alert("Cancel failed");
    }
  };

  /* =========================
     🔁 RETURN HANDLER
  ========================= */

  const handleReturn = async () => {
    try {
      const reason = prompt("Enter return reason:");

      if (!reason) {
        alert("Reason required");
        return;
      }

      await api.put(`/orders/return/${order._id}`, { reason });

      alert("Return requested");

      // 🔥 update without reload
      setOrder((prev) => ({
        ...prev,
        deliveryStatus: "Return Requested",
        history: [
          ...(prev.history || []),
          {
            status: "Return Requested",
            date: new Date(),
          },
        ],
      }));
    } catch (err) {
      alert("Return failed");
    }
  };

  return (
    <div className="order-details-container">

      {/* HEADER */}
      <div className="order-header">
        <h2>Order Details</h2>
        <span className="status">{order.deliveryStatus}</span>
      </div>

      {/* ORDER INFO */}
      <div className="order-info-box">
        <p><strong>Order ID:</strong> #{order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toDateString()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Payment:</strong> {order.paymentStatus}</p>
      </div>

      {/* ADDRESS */}
      <div className="order-section">
        <h3>Delivery Address</h3>
        <p>{order.address}</p>
        <p>{order.phone}</p>
      </div>

      {/* PRODUCTS */}
      <div className="order-section">
        <h3>Items</h3>

        {order.products.map((item, i) => (
          <div key={i} className="order-product">
        <img
  src={item.product?.images?.[0] || item.image || "/no-image.png"}
  alt={item.product?.name || item.name}
  onClick={() => {
    if (item.product?._id) {
      navigate(`/product/${item.product._id}`);
    }
  }}
  style={{ cursor: item.product?._id ? "pointer" : "default" }}
/>

            <div>
              <p className="product-name">
                {item.product?.name || item.name}
              </p>
              <p>Size: {item.size || "Free Size"}</p>
              <p>Qty: {item.qty}</p>
              <p>₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="order-section">
        <h3>Order Timeline</h3>

        <div className="timeline">
          {order.history?.map((step, index) => (
            <div key={index} className="timeline-item">
              <div className="dot"></div>
              <div>
                <p>{step.status}</p>
                <span>
                  {new Date(step.date).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="order-actions">

        {isCancelable && (
          <button
            disabled={!isCancelable}
            className="cancel-btn"
            onClick={handleCancel}
          >
            {order.deliveryStatus === "Cancelled"
              ? "Order Cancelled"
              : "Cancel Order"}
          </button>
        )}

        {isReturnable && (
          <button
            className="return-btn"
            onClick={handleReturn}
          >
            Return Order
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderDetails;