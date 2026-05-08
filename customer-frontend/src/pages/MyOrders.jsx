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
                <p>Tracking ID: {order.trackingId}</p>
                <p>Courier ID: {order.awbCode || "Generating..."}</p>
                <button className="return-btn"
                  onClick={() => navigator.clipboard.writeText(order.awbCode)}>
                  Track Order 🚚
                </button>
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
                    src={
                      item.product?.images?.[0] ||
                      item.image ||
                      "/no-image.png"
                    }
                    alt={item.product?.name || item.name}
                    className="order-product-img"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (item.product?._id) {
                        navigate(`/product/${item.product._id}`);
                      }
                    }}
                  />

                  <div className="order-product-info">
                    <p className="product-name">
                      {item.product?.name}
                    </p>

                    <p>Size: {item.size || "Free Size"}</p>
                    <p>Qty: {item.qty}</p>
                    <div className="order-status-box">
                      <span className={`status-badge ${order.deliveryStatus}`}>
                        {order.deliveryStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;