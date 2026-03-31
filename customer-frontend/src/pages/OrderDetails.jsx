import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/orderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("userToken");

  const isCancelable =
    !["Shipped", "Out for Delivery", "Delivered"].includes(order?.deliveryStatus);

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id, API_URL, token]);

  if (!order) return <p className="loading">Loading...</p>;

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
            className="cancel-btn"
            onClick={async () => {
              try {
                const reason = prompt("Enter cancellation reason:");

                if (!reason) {
                  alert("Reason required");
                  return;
                }

                await axios.put(
                  `${API_URL}/api/orders/cancel/${order._id}`,
                  { reason },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                alert("Order cancelled");
                window.location.reload();
              } catch (err) {
                alert("Cancel failed");
              }
            }}
          >
            Cancel Order
          </button>
        )}

        {isReturnable && (
          <button
            className="return-btn"
            onClick={async () => {
              try {
                const reason = prompt("Enter return reason:");

                if (!reason) {
                  alert("Reason required");
                  return;
                }

                await axios.put(
                  `${API_URL}/api/orders/return/${order._id}`,
                  { reason },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                alert("Return requested");
                window.location.reload();
              } catch (err) {
                alert("Return failed");
              }
            }}
          >
            Return Order
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderDetails;