import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import {
  fetchCustomers,
  blockCustomer,
  deleteCustomer,
} from "../api/customers";
import CustomerModal from "../components/CustomerModal";
import { useToast } from "../components/Toast";
import "../styles/theme.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const load = async () => {
    const data = await fetchCustomers();
    setCustomers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleBlock = async (id) => {
    await blockCustomer(id);
    showToast("Customer status updated", "success");
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    await deleteCustomer(id);
    showToast("Customer deleted", "success");
    load();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const total = customers.length;
  const blocked = customers.filter((c) => c.isBlocked).length;
  const active = total - blocked;

  return (
    <PageLayout title="Customers">
      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Customers</h4>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <h4>Active</h4>
          <h2>{active}</h2>
        </div>

        <div className="stat-card">
          <h4>Blocked</h4>
          <h2>{blocked}</h2>
        </div>
      </div>

      <TableCard
        title="Customers"
        right={
          <input
            className="input"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
          />
        }
      >
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-row">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c._id}>
                  {/* CLICKABLE NAME */}
                  <td
                    style={{ cursor: "pointer", fontWeight: 500 }}
                    onClick={() => navigate(`/customers/${c._id}`)}
                  >
                    {c.name}
                  </td>

                  <td>{c.email}</td>

                  <td>
                    <span
                      className={`badge ${
                        c.isBlocked ? "badge-danger" : "badge-success"
                      }`}
                    >
                      {c.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedCustomer(c)}
                      >
                        Details
                      </button>

                      <button
                        className="view-btn"
                        onClick={() => handleBlock(c._id)}
                      >
                        {c.isBlocked ? "Unblock" : "Block"}
                      </button>

                      <button
                        className="view-btn danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>

      {/* CUSTOMER POPUP */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </PageLayout>
  );
};

export default Customers;
