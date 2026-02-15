import { useEffect, useState } from "react";
import { fetchCustomerOrders } from "../api/customers";
import "./CustomerModal.css";

const CustomerModal = ({ customer, onClose }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchCustomerOrders(customer._id).then(setOrders);
  }, [customer._id]);

const totalItems = orders.reduce((sum, order) => {
  return (
    sum +
    order.products.reduce(
      (sub, p) => sub + (p.quantity || 0),
      0
    )
  );
}, 0);
const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="modal-overlay">
      <div className="customer-modal">

        <div className="modal-header">
          <h2>Customer Details</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="customer-info">
          <div className="info-row">
            <span>Name</span>
            <strong>{customer.name}</strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>{customer.email}</strong>
          </div>

          <div className="info-row">
            <span>Status</span>
            <span className={`badge ${customer.isBlocked ? "badge-danger" : "badge-success"}`}>
              {customer.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
        </div>

        <div className="divider" />

        <div className="customer-stats">
  <div className="stat-box">
    <span>Total Orders</span>
    <strong>{orders.length}</strong>
  </div>

  <div className="stat-box">
    <span>Total Items</span>
    <strong>{totalItems}</strong>
  </div>

  <div className="stat-box">
    <span>Total Spent</span>
    <strong>₹{totalSpent}</strong>
  </div>
</div>


        <h4 className="section-title">Recent Orders</h4>

        <div className="order-list">
          {orders.length === 0 ? (
            <div className="empty-state">No orders yet</div>
          ) : (
            orders.slice(0, 5).map((o) => (
              <div key={o._id} className="order-item">
                <div>
                  <strong>#{o._id.slice(-6)}</strong>
                  <div className="order-date">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  ₹{o.totalAmount}
                </div>

                <div>
                  <span className={`badge ${
                    o.paymentStatus === "Verified"
                      ? "badge-success"
                      : o.paymentStatus === "Rejected"
                      ? "badge-danger"
                      : ""
                  }`}>
                    {o.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerModal;
