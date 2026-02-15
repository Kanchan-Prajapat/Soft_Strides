import { useEffect, useState } from "react";
import API from "../api/api";
import PageLayout from "../components/PageLayout";
import "../styles/theme.css";

const RejectedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders?type=rejected");
      setOrders(res.data);
    } catch (error) {
      console.error("Error loading rejected orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <PageLayout title="Rejected Orders">
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No rejected orders found</p>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="card" style={{ marginBottom: 30 }}>
            <h4>Order #{o._id.slice(-6)}</h4>

            <p><strong>Customer:</strong> {o.user?.name}</p>
            <p><strong>Email:</strong> {o.user?.email}</p>
            <p><strong>Total:</strong> ₹{o.totalAmount}</p>

            {o.cancelReason && (
              <p><strong>Cancel Reason:</strong> {o.cancelReason}</p>
            )}

            {o.returnReason && (
              <p><strong>Return Reason:</strong> {o.returnReason}</p>
            )}

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "red" }}>
                {o.deliveryStatus}
              </span>
            </p>

            {/* Timeline */}
            <div style={{ marginTop: 20 }}>
              <h5>Process Timeline</h5>
            <div className="timeline-horizontal">
  {order.history?.map((item, index) => (
    <div key={index} className="timeline-step">
      <div className="timeline-dot" />
      <p className="timeline-status">{item.status}</p>
      <small>
        {new Date(item.date).toLocaleString()}
      </small>
    </div>
  ))}
</div>
            </div>
          </div>
        ))
      )}
    </PageLayout>
  );
};

export default RejectedOrders;
