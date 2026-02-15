import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { fetchCustomers, fetchCustomerOrders } from "../api/customers";

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchCustomers().then((data) => {
      const found = data.find((c) => c._id === id);
      setCustomer(found);
    });

    fetchCustomerOrders(id).then(setOrders);
  }, [id]);

  if (!customer) return null;

  const totalSpent = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  return (
    <PageLayout title="Customer Profile">

      <div className="card" style={{ marginBottom: 20 }}>
        <h3>{customer.name}</h3>
        <p>Email: {customer.email}</p>
        <p>Status: {customer.isBlocked ? "Blocked" : "Active"}</p>
        <p>Total Orders: {orders.length}</p>
        <p>Total Spent: ₹{totalSpent}</p>
      </div>

      <div className="card">
        <h3>Order History</h3>

        <table className="table">
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
                <td>{o._id.slice(-6)}</td>
                <td>₹{o.totalAmount}</td>
                <td>{o.paymentStatus}</td>
                <td>
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </PageLayout>
  );
};

export default CustomerDetails;
