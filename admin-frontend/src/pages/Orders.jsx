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
const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
const [deliveryFilter, setDeliveryFilter] = useState("");


  // 🔄 Update Delivery Status
 const updateStatus = async (id, status) => {
  try {
    await API.put(`/orders/delivery/${id}`, { status });

    // refresh orders
    loadOrders();

  } catch (error) {
    console.error("Delivery update failed", error);
  }
};

/* ===========================
   ORDER SUMMARY
=========================== */

const totalOrders = orders.length;

const onlineOrders = orders.filter(
  (o) => o.paymentMethod === "ONLINE"
).length;

const codOrders = orders.filter(
  (o) => o.paymentMethod === "COD"
).length;

const pendingDelivery = orders.filter(
  (o) =>
    o.deliveryStatus !== "Delivered" &&
    o.deliveryStatus !== "Cancelled"
).length;

const totalRevenue = orders.reduce(
  (sum, o) => sum + o.totalAmount,
  0
);

  // 🔍 Filter Logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingId?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter
  ? o.paymentStatus === statusFilter
  : true;

const matchesMethod = paymentMethodFilter
  ? o.paymentMethod === paymentMethodFilter
  : true;

const matchesDelivery = deliveryFilter
  ? o.deliveryStatus === deliveryFilter
  : true;

return (
  matchesSearch &&
  matchesStatus &&
  matchesMethod &&
  matchesDelivery
);
  });

  return (
    <PageLayout title="Orders">

    <div className="stats-grid">

  <div className="stat-card">

    <span>Total Orders</span>

    <strong>{totalOrders}</strong>

  </div>

  <div className="stat-card">

    <span>Online Orders</span>

    <strong>{onlineOrders}</strong>

  </div>

  <div className="stat-card">

    <span>COD Orders</span>

    <strong>{codOrders}</strong>

  </div>

  <div className="stat-card">

    <span>Pending Delivery</span>

    <strong>{pendingDelivery}</strong>

  </div>

  <div className="stat-card">

    <span>Revenue</span>

    <strong>₹{totalRevenue}</strong>

  </div>

</div>
      <TableCard
        title="All Orders"
       right={
  <div className="orders-toolbar">

    <input
      className="input toolbar-search"
      placeholder="🔍 Search order, customer, tracking..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      className="input toolbar-select"
      value={paymentMethodFilter}
      onChange={(e) =>
        setPaymentMethodFilter(e.target.value)
      }
    >
      <option value="">💳 Payment Method</option>
      <option value="ONLINE">Online</option>
      <option value="COD">Cash on Delivery</option>
    </select>

    <select
      className="input toolbar-select"
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
    >
      <option value="">💰 Payment Status</option>
      <option value="Pending">Pending</option>
      <option value="Verified">Verified</option>
      <option value="Rejected">Rejected</option>
      <option value="Paid">Paid</option>
    </select>

    <select
      className="input toolbar-select"
      value={deliveryFilter}
      onChange={(e) =>
        setDeliveryFilter(e.target.value)
      }
    >
      <option value="">🚚 Delivery</option>
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Packed">Packed</option>
      <option value="Shipped">Shipped</option>
      <option value="Out for Delivery">
        Out for Delivery
      </option>
      <option value="Delivered">
        Delivered
      </option>
    </select>

    <button
      className="refresh-btn"
      onClick={loadOrders}
    >
      🔄 Refresh
    </button>

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
              <th>Method</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Tracking ID</th>
              <th>AWB Code</th>
              <th>Actions</th>
               <th>Tracking</th>
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
<td>
  <span
    className={`payment-method-badge ${
      o.paymentMethod === "COD"
        ? "cod"
        : "online"
    }`}
  >
    {o.paymentMethod === "COD"
      ? " COD"
      : " Online"}
  </span>
</td>

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
                      onChange={(e) => updateStatus(o._id, e.target.value)}
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
                  <td>{o.awbCode || "Not generated"}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(o)}
                    >
                      Details
                    </button>
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={async () => {
                    const res = await API.get(`/orders/track/${o._id}`);
                        console.log(res.data);
                      }}
                    >
                      Refresh Tracking
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
