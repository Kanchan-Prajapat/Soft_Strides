import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import avatar from "./default-avtar.png";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("userToken");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [editingIndex, setEditingIndex] = useState(null);
  const [addresses, setAddresses] = useState(user?.addresses || []);
const [newAddress, setNewAddress] = useState({
  name: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  state: ""
});
  const [orders, setOrders] = useState([]);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };


    if (token) fetchOrders();


  }, [API_URL, token]);


  

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      setUser(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message);
    }


  };

  /* ================= UPDATE ADDRESS ================= */
 const updateAddress = async () => {
  try {
    const res = await axios.put(
      `${API_URL}/api/users/update-address/${editingIndex}`,
      newAddress,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.data);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setAddresses(res.data.addresses);

    setEditingIndex(null);
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      state: ""
    });

    alert("Address updated");
  } catch (err) {
    alert("Update failed");
  }
};

  /* ================= DELETE ACCOUNT ================= */
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure?")) return;


    try {
      await axios.delete(`${API_URL}/api/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logout();
      alert("Account deleted");
    } catch (err) {
      alert(err.response?.data?.message);
    }

  };

   const addAddress = async () => {
  try {
    const res = await axios.put(
      `${API_URL}/api/users/add-address`,
      newAddress,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.data);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setAddresses(res.data.addresses);
    alert("Address added");
  } catch (err) {
    alert("Failed to add address");
  }
};


const deleteAddress = async (index) => {
  if (!window.confirm("Delete this address?")) return;

  try {
    const res = await axios.delete(
      `${API_URL}/api/users/delete-address/${index}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUser(res.data);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setAddresses(res.data.addresses);

    alert("Address deleted");
  } catch (err) {
    alert("Delete failed");
  }
};


  return (<div className="container profile-page"> <h2 className="profile-title">My Profile</h2>


    <div className="profile-grid">

      {/* LEFT SIDEBAR */}
      <div className="profile-sidebar">

        <div className="profile-card">
          <h3 className="profile-card-title">Account Information</h3>

          <div className="profile-avatar-section">
            <img
              src={user?.profileImage || avatar}
              alt="Profile"
              className="profile-avatar"
            />
            <label className="upload-btn">
              Change Photo
              <input type="file" hidden />
            </label>
          </div>

          <div className="profile-info-row">
            <span className="label">Name</span>
            <span className="value">{user?.name}</span>
          </div>

          <div className="profile-info-row">
            <span className="label">Email</span>
            <span className="value">{user?.email}</span>
          </div>

          <div className="profile-info-row">
            <span className="label">Mobile</span>
            <span className="value">{user?.phone || "Not added"}</span>
          </div>

          <div className="profile-info-row">
            <span className="label">Location</span>
            <span className="value">{user?.location || "Not added"}</span>
          </div>

          {/* ACTION BUTTONS (FIXED) */}
          <div className="profile-actions">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
            <button className="delete-btn" onClick={deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>

        {/* ORDERS */}
        <div className="sidebar-orders">
          <h3>My Orders</h3>

          {orders.length === 0 ? (
            <p className="no-orders">No orders yet</p>
          ) : (
            <>
              {orders.slice(0, 2).map((order) => (
                <div key={order._id} className="sidebar-order-card">

                  {order.products?.[0] && (
                    <div className="sidebar-order-product">

                      <img
                       src={
  order.products[0].product?.images?.[0] ||
  order.products[0].image ||
  "/no-image.png"
}
                        alt={order.products[0].product?.name || order.products[0].name}
                      />



                      <div className="order-info">
                      <p className="order-id">
  Order #{order._id.slice(-5)}
</p>
                        <p className="product-name">
                          {order.products[0].product?.name || order.products[0].name}
                        </p>

                        <p className="order-meta">
                          Size: {order.products[0].size || "Free Size"}
                        </p>

                        <p className="order-price">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="sidebar-status">
                    {order.deliveryStatus}
                  </p>
                </div>
              ))}

              <button
                className="view-orders-btn"
                onClick={() => navigate("/my-orders")}
              >
                View All Orders →
              </button>
            </>
          )}
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="profile-content">

        <div className="profile-section">
          <h3>Update Profile</h3>

          <input value={name} placeholder="Name" disabled={!isEditing} onChange={(e) => setName(e.target.value)} />
          <input value={email} placeholder="Email" disabled={!isEditing} onChange={(e) => setEmail(e.target.value)} />
          <input value={phone} placeholder="Phone" disabled={!isEditing} onChange={(e) => setPhone(e.target.value)} />

          {!isEditing ? (
            <button className="profile-btn edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button
              className="profile-btn save"
              onClick={() => {
                updateProfile(); // tera existing API call
                setIsEditing(false);
              }}
            >
              Save Changes
            </button>
          )}
        </div>

        <div className="profile-section">
  <h3>Add Address</h3>

  <input
    placeholder="Full Name"
    value={newAddress.name}
    onChange={(e) =>
      setNewAddress({ ...newAddress, name: e.target.value })
    }
  />

  <input
    placeholder="Phone"
    value={newAddress.phone}
    onChange={(e) =>
      setNewAddress({ ...newAddress, phone: e.target.value })
    }
  />

  <input
    placeholder="Address"
    value={newAddress.address}
    onChange={(e) =>
      setNewAddress({ ...newAddress, address: e.target.value })
    }
  />

  <input
    placeholder="City"
    value={newAddress.city}
    onChange={(e) =>
      setNewAddress({ ...newAddress, city: e.target.value })
    }
  />

  <input
    placeholder="Pincode"
    value={newAddress.pincode}
    onChange={(e) =>
      setNewAddress({ ...newAddress, pincode: e.target.value })
    }
  />

  <input
    placeholder="State"
    value={newAddress.state}
    onChange={(e) =>
      setNewAddress({ ...newAddress, state: e.target.value })
    }
  />
<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  <button
    className="profile-btn save"
    onClick={editingIndex !== null ? updateAddress : addAddress}
  >
    {editingIndex !== null ? "Update Address" : "Add Address"}
  </button>

  {editingIndex !== null && (
    <button
      className="profile-btn edit"
      onClick={() => {
        setEditingIndex(null);
        setNewAddress({
          name: "",
          phone: "",
          address: "",
          city: "",
          pincode: "",
          state: ""
        });
      }}
    >
      Cancel
    </button>
  )}
</div>
</div>



{addresses.length > 0 && (
  <div style={{ marginTop: "10px" }}>
    {addresses.map((addr, i) => (
  <div
  key={i}
  className="profile-info-row"
  style={{
    marginBottom: "10px",
    padding: "12px",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    background: "#111"
  }}
>

  {/* TEXT */}
  <div style={{ marginBottom: "10px" }}>
    <p className="value">{addr.name}</p>
    <p style={{ fontSize: "13px", color: "#aaa" }}>
      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
    </p>
  </div>

  {/* BUTTONS */}
  <div style={{ display: "flex", gap: "10px" }}>
    <button
      className="profile-btn edit"
      onClick={() => {
        setEditingIndex(i);
        setNewAddress(addr);
      }}
    >
      Edit
    </button>

    <button
      className="profile-btn delete"
      onClick={() => deleteAddress(i)}
    >
      Delete
    </button>
  </div>

</div>
    ))}
  </div>
)}

      </div>
    </div>
  </div>


  );
};

export default Profile;
