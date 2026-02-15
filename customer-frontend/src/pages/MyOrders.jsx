import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/orders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("userToken");
const API_URL = process.env.REACT_APP_API_URL;

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
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">

            <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Status:</strong> {order.deliveryStatus}</p>

            {/* PRODUCTS */}
           {order.products?.map((item, index) => (
  <div key={index} className="order-product-row">

  {item.image ? (
  <img
    src={item.image}
    alt={item.name}
    className="order-product-img"
  />
) : (
  <div className="order-product-placeholder">
    No Image
  </div>
)}


    <div className="order-product-info">
      <p className="product-name">{item.name}</p>
      <p>Qty: {item.qty}</p>
      <p>Size: {item.size}</p>
    </div>

  </div>
))}

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