import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import PaymentModal from "../components/PaymentModal";
import { fetchPayments } from "../api/payments";
import "../styles/theme.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const data = await fetchPayments();
    setPayments(data);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p._id.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === "All" ? true : p.paymentStatus === filter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "Verified")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <PageLayout title="Payments">
      {/* SUMMARY CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Payments</span>
          <strong>{payments.length}</strong>
        </div>

        <div className="stat-card">
          <span>Verified</span>
          <strong>
            {payments.filter((p) => p.paymentStatus === "Verified").length}
          </strong>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <strong>
            {payments.filter((p) => p.paymentStatus !== "Verified").length}
          </strong>
        </div>

        <div className="stat-card">
          <span>Revenue</span>
          <strong>₹{totalRevenue}</strong>
        </div>
      </div>

      <TableCard
        title="Payment Transactions"
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <input
              className="input"
              placeholder="Search payment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />

            <select
              className="input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 150 }}
            >
              <option value="All">All</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        }
      >
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p._id}>
                <td>#{p._id.slice(-6)}</td>
                <td>{p.user?.name}</td>
                <td>₹{p.totalAmount}</td>
                <td>
                  <span
                    className={`badge ${
                      p.paymentStatus === "Verified"
                        ? "badge-paid"
                        : "badge-pending"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => setSelected(p)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {selected && (
        <PaymentModal
          payment={selected}
          onClose={() => setSelected(null)}
          onUpdate={load}
        />
      )}
    </PageLayout>
  );
};

export default Payments;
