import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import API from "../api/api";
import "../styles/theme.css";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
const [minAmount, setMinAmount] = useState("");


  const loadCoupons = async () => {
    try {
      const res = await API.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);
const handleCreate = async () => {
  try {
    setLoading(true);

    await API.post("/coupons", {
      code,
      discount,
      expiryDate,
      minAmount,
    });

    alert("Coupon created");

    setCode("");
    setDiscount("");
    setExpiryDate("");
    setMinAmount("");

    loadCoupons();
  } catch (err) {
    alert(err.response?.data?.message || "Error creating coupon");
  } finally {
    setLoading(false);
  }
};

  const toggleCoupon = async (id) => {
    await API.put(`/coupons/${id}/toggle`);
    loadCoupons();
  };

  const deleteCoupon = async (id) => {
    await API.delete(`/coupons/${id}`);
    loadCoupons();
  };

  return (
    <PageLayout title="Coupons">
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Create Coupon</h3>

        <div style={{ display: "flex", gap: 10 }}>
         <input
  placeholder="Code"
  value={code}
  onChange={(e) => setCode(e.target.value)}
/>

<input
  type="number"
  placeholder="Discount %"
  value={discount}
  onChange={(e) => setDiscount(e.target.value)}
/>

<input
  type="date"
  value={expiryDate}
  onChange={(e) => setExpiryDate(e.target.value)}
/>

<input
  type="number"
  placeholder="Minimum Order Amount"
  value={minAmount}
  onChange={(e) => setMinAmount(e.target.value)}
/>

          <button
            className="btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Coupon"}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>All Coupons</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td>{c.code}</td>
                <td>{c.discount}%</td>
                <td>{c.isActive ? "Active" : "Disabled"}</td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => toggleCoupon(c._id)}
                  >
                    Toggle
                  </button>
                  <button
                    className="danger-btn"
                    onClick={() => deleteCoupon(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default Coupons;
