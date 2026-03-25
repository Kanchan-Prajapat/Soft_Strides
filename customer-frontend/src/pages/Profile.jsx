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

useEffect(() => {
if (!user) navigate("/login");
}, [user, navigate]);

const [name, setName] = useState(user?.name || "");
const [email, setEmail] = useState(user?.email || "");
const [phone, setPhone] = useState(user?.phone || "");
const [location, setLocation] = useState(user?.location || "");
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

/* ================= UPDATE LOCATION ================= */
const updateLocation = async () => {
try {
const res = await axios.put(
`${API_URL}/api/users/location`,
{ location },
{ headers: { Authorization: `Bearer ${token}` } }
);


  setUser(res.data);
  localStorage.setItem("userInfo", JSON.stringify(res.data));
  alert("Location updated successfully");
} catch (err) {
  alert(err.response?.data?.message);
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

return ( <div className="container profile-page"> <h2 className="profile-title">My Profile</h2>


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
    <p className="no-orders">No orders found</p>
  ) : (
    <>
      {orders.slice(0, 2).map((order) => (
        <div key={order._id} className="sidebar-order-card">

          {order.products?.[0] && (
            <div className="sidebar-order-product">
              <img
                src={order.products[0].image}
                alt={order.products[0].name}
              />

              <div className="order-info">
                <p className="product-name">
                  {order.products[0].name}
                </p>

                <p className="order-meta">
                  Size: {order.products[0].size}
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

        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <button className="primary-btn" onClick={updateProfile}>
          Save Changes
        </button>
      </div>

      <div className="profile-section">
        <h3>Set Location</h3>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="primary-btn" onClick={updateLocation}>
          Save Location
        </button>
      </div>

    </div>
  </div>
</div>


);
};

export default Profile;
