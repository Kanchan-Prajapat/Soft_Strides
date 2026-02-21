import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/orders.css";
import { useNavigate } from "react-router-dom";


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("userToken");
const API_URL = process.env.REACT_APP_API_URL;
const navigate= useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchOrders();
  }, [token, API_URL]);

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
        <div key={order._id} className="order-card">

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
        src={item.image}
        alt={item.name}
        className="order-product-img"
        onClick={() => navigate(`/product/${item.product._id}`)}
        style={{ cursor: "pointer" }}
      />

      <div className="order-product-info">
        <p className="product-name">{item.name}</p>
        <p>Size: {item.size}</p>
        <p>Qty: {item.qty}</p>
      </div>

    </div>
  ))}
</div>

          {/* TIMELINE */}
          <div className="timeline-horizontal">
            {order.history?.map((step, index) => (
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

        </div>
      ))
    )}
  </div>
);
};

export default MyOrders;