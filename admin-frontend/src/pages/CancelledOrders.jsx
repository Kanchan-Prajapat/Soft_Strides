import { useEffect, useState } from "react";
import API from "../api/api";
import PageLayout from "../components/PageLayout";

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders?type=cancelled");
      setOrders(res.data);
    } catch (error) {
      console.error("Error loading cancelled orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <PageLayout title="Cancelled Orders">
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No cancelled orders found</p>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="card" style={{ marginBottom: 20 }}>
            <h4>Order #{o._id.slice(-6)}</h4>

            <p><strong>Customer:</strong> {o.user?.name}</p>
            <p><strong>Email:</strong> {o.user?.email}</p>
            <p><strong>Total:</strong> ₹{o.totalAmount}</p>
            <p><strong>Cancel Reason:</strong> {o.cancelReason}</p>
            <p><strong>Payment:</strong> {o.paymentStatus}</p>
            <p><strong>Delivery Status:</strong> {o.deliveryStatus}</p>
            <p><strong>Cancel Reason:</strong> {o.cancelReason}</p>

            <div style={{ marginTop: 10 }}>
              {o.products.map((item, index) => (
                <div key={index}>
                  {item.product?.name} × {item.qty}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </PageLayout>
  );
};

export default CancelledOrders;

