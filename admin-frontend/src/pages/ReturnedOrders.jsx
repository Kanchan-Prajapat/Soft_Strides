import { useEffect, useState } from "react";
import API from "../api/api";
import PageLayout from "../components/PageLayout";

const ReturnedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders?type=returned");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const approveReturn = async (id) => {
    await API.put(`/orders/return/approve/${id}`);
    loadOrders();
  };

const rejectReturn = async (id) => {
  try {
    await API.put(`/orders/return/reject/${id}`);
    loadOrders();
  } catch (err) {
    console.error(err);
    alert("Reject failed");
  }
};



  const updateReturnStep = async (id, status) => {
    await API.put(`/orders/return/update/${id}`, { status });
    loadOrders();
  };

  return (
    <PageLayout title="Returned Orders">
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No returned orders found</p>
      ) : (
        orders.map((o) => {
          const sortedTimeline = (o.history || []).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          return (
            <div key={o._id} className="card" style={{ marginBottom: 30 }}>
              <h4>Order #{o._id.slice(-6)}</h4>

              <p><strong>Customer:</strong> {o.user?.name}</p>
              <p><strong>Email:</strong> {o.user?.email}</p>
              <p><strong>Total:</strong> ₹{o.totalAmount}</p>
              <p><strong>Return Reason:</strong> {o.returnReason}</p>
              <p><strong>Status:</strong> {o.deliveryStatus}</p>

              <div style={{ marginTop: 20 }}>
                <h5>Process Timeline</h5>

                {sortedTimeline.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderLeft: "2px solid #444",
                      paddingLeft: 15,
                      marginBottom: 15,
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "#00ffcc" }}>
                      {item.status}
                    </div>
                    <small style={{ color: "#aaa" }}>
                      {new Date(item.date).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>

              {o.deliveryStatus === "Return Requested" && (
                <div style={{ marginTop: 15 }}>
                  <button onClick={() => approveReturn(o._id)}>
                    Approve
                  </button>

                  <button
                    onClick={() => rejectReturn(o._id)}
                    style={{ marginLeft: 10 }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {o.deliveryStatus === "Return Approved" && (
                <div style={{ marginTop: 15 }}>
                  <button onClick={() => updateReturnStep(o._id, "Pickup Scheduled")}>
                    Pickup Scheduled
                  </button>

                  <button
                    onClick={() => updateReturnStep(o._id, "Picked Up")}
                    style={{ marginLeft: 8 }}
                  >
                    Picked Up
                  </button>

                  <button
                    onClick={() => updateReturnStep(o._id, "Returned")}
                    style={{ marginLeft: 8 }}
                  >
                    Returned
                  </button>

                  <button
                    onClick={() => updateReturnStep(o._id, "Refund Done")}
                    style={{ marginLeft: 8 }}
                  >
                    Refund Done
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </PageLayout>
  );
};

export default ReturnedOrders;
