// src/pages/CustomerOrders.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { fetchCustomerOrders } from "../api/customers";
import "../styles/theme.css";

const CustomerOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchCustomerOrders(id).then(setOrders);
  }, [id]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        <h1>Customer Orders</h1>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.paymentStatus}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrders;
