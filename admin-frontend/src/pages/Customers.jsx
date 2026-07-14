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
import API from "../api/api";



const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  let admin = {};

  try {
    admin = JSON.parse(localStorage.getItem("adminInfo")) || {};
  } catch (err) {
    admin = {};
  }
  console.log("ADMIN:", admin);

  useEffect(() => {
  console.log("DATA:", customers);
}, [customers]);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchCustomers().then(setCustomers);
  }, [search]);

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

const searchText = search.toLowerCase();



const filteredCustomers = customers.filter((c) => {
  const name = c.name?.toLowerCase() || "";
  const email = c.email?.toLowerCase() || "";
  const role = c.role?.toLowerCase() || "";

  return (
    name.includes(searchText) ||
    email.includes(searchText) ||
    role.includes(searchText)
  );
});


  const isSuperAdmin =
    admin?.email === "softstride7@gmail.com" ||
    admin?.email === "kanchanprajapat208@gmail.com"

 /* ===========================
   CUSTOMER STATS
=========================== */

const totalCustomers = customers.length;

const activeCustomers = customers.filter(
  (c) => !c.isBlocked
).length;

const blockedCustomers = customers.filter(
  (c) => c.isBlocked
).length;

const admins = customers.filter(
  (c) => c.role === "admin"
).length;

  return (
    <PageLayout title="Customers">
      {/* STATS CARDS */}
      <div className="stats-grid">

  <div className="stat-card">
    <span>Total Customers</span>
    <strong>{totalCustomers}</strong>
  </div>

  <div className="stat-card success">
    <span>Active Customers</span>
    <strong>{activeCustomers}</strong>
  </div>

  <div className="stat-card danger">
    <span>Blocked</span>
    <strong>{blockedCustomers}</strong>
  </div>

  <div className="stat-card warning">
    <span>Admins</span>
    <strong>{admins}</strong>
  </div>

</div>

      <TableCard
        title="Customers"
       right={
  <div className="orders-toolbar">

    <input
      className="input toolbar-search"
      placeholder="🔍 Search customer..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <button
      className="refresh-btn"
      onClick={() =>
        fetchCustomers().then(setCustomers)
      }
    >
      🔄 Refresh
    </button>

  </div>
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
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/customers/${c._id}`)}
>

  <div className="customer-info">

    <strong>{c.name}</strong>

    <small>{c.email}</small>

  </div>

</td>

                  <td>
                    <span
                      className={`badge ${c.isBlocked ? "badge-danger" : "badge-success"
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

                      {isSuperAdmin && (
                        <button
                          className="view-btn danger"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      )}

                      {isSuperAdmin && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                          <span style={{ color: "#aaa", fontSize: "13px" }}>
                            Access:
                          </span>

                          <select
                            className="input"
                            value={c.role}
                            style={{ width: "100px", padding: "5px" }}
                            onChange={async (e) => {
                              await API.put(`/users/role/${c._id}`, {
                                role: e.target.value,
                              });

                              showToast("Role updated", "success");
                              window.location.reload();
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>

                        </div>
                      )}
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
