import { useEffect, useState } from "react";
import "../styles/orders.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data || []);
      } catch (error) {
        console.error("FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔥 Loading UI
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  // 🔥 No token fallback
  const token = localStorage.getItem("userToken");
  if (!token) {
    return <h2 style={{ textAlign: "center" }}>Please login</h2>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="order-card"
            onClick={() => navigate(`/order/${order._id}`)}
            style={{ cursor: "pointer" }}
          >
            {/* HEADER */}
            <div className="order-top">
              <div>
                <p className="order-id">
                  Order ID: #{order._id.slice(-6)}
                </p>
                <p className="order-date">
                  {new Date(order.createdAt).toDateString()}
                </p>
              </div>

              <div className="order-summary">
                <p>₹{order.totalAmount}</p>
                <span className="status">
                  {order.deliveryStatus}
                </span>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="order-products">
              {order.products?.map((item, index) => (
                <div key={index} className="order-product-row">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="order-product-img"
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 prevent card click
                      navigate(`/product/${item.product?._id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  />

                  <div className="order-product-info">
                    <p className="product-name">
                      {item.product?.name}
                    </p>

                    <p>Size: {item.size || "Free Size"}</p>
                    <p>Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* TIMELINE */}
            {order.history?.length > 0 ? (
              <div className="timeline-horizontal">
                {order.history.map((step, index) => (
                  <div key={index} className="timeline-step">
                    <div className="timeline-status">
                      {step.status}
                    </div>
                    <div className="timeline-date">
                      {new Date(step.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-timeline">Order placed</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;