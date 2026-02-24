import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import OrderModal from "../components/OrderModal";
import API from "../api/api";
import "../styles/theme.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Load Orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔄 Update Payment Status
  const updatePaymentStatus = async (id, status) => {
    try {
      await API.put(`/orders/payment/${id}`, { status });
      loadOrders();
    } catch (error) {
      console.error("Payment status update failed", error);
    }
  };



  // 🔄 Update Delivery Status
  const updateDeliveryStatus = async (id, status) => {
    try {
      await API.put(`/orders/delivery/${id}`, { status });
      loadOrders();
    } catch (error) {
      console.error("Delivery update failed", error);
    }
  };

  // 🔍 Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter
      ? o.paymentStatus === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageLayout title="Orders">
      <TableCard
        title="All Orders"
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />

            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        }
      >
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Tracking ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  Loading...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-6)}</td>

                  <td>
                    {o.products?.length > 0 && (
                      <img
                        src={o.products[0].image}
                        alt={o.products[0].name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    )}
                  </td>

                  <td>
                    {o.user?.name}
                    <br />
                    <small>{o.user?.email}</small>
                  </td>

                  <td>₹{o.totalAmount}</td>

                  {/* Payment Dropdown */}
                  <td>
                    <select
                      value={o.paymentStatus}
                      onChange={(e) =>
                        updatePaymentStatus(o._id, e.target.value)
                      }
                      className="input"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Delivery Dropdown */}
                  <td>
                    <select
                      value={o.deliveryStatus}
                      onChange={(e) =>
                        updateDeliveryStatus(o._id, e.target.value)
                      }
                      className="input"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                  <td>{o.trackingId}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(o)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </PageLayout>
  );
};

export default Orders;
