import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";


const Profile = () => {

    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("userToken");

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [location, setLocation] = useState(user?.location || "");
    const [orders, setOrders] = useState([]);

    /* =========================
       FETCH ORDERS
    ========================== */
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/orders/my-orders`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setOrders(res.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        if (token) fetchOrders();
    }, [API_URL, token]);

    /* =========================
       UPDATE PROFILE
    ========================== */
    const updateProfile = async () => {
        try {
            const res = await axios.put(
                `${API_URL}/api/users/profile`,
                { name, email, phone },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUser(res.data); // 🔥 update context
            localStorage.setItem("userInfo", JSON.stringify(res.data));

            alert("Profile updated successfully");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

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

    /* =========================
       UPDATE PASSWORD
    ========================== */
    const updatePassword = async () => {
        try {
            await axios.put(
                `${API_URL}/api/users/change-password`,
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Password updated");
            setOldPassword("");
            setNewPassword("");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    /* =========================
       CANCEL ORDER
    ========================== */
    const cancelOrder = async (orderId) => {
        try {
            await axios.put(
                `${API_URL}/api/orders/cancel/${orderId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId
                        ? { ...o, deliveryStatus: "Cancelled" }
                        : o
                )
            );

            alert("Order cancelled");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    /* =========================
       DELETE ACCOUNT
    ========================== */
    const deleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/users/delete`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            logout();
            alert("Account deleted successfully");
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    return (
        <div className="container profile-page">
            <h2 className="profile-title">My Profile</h2>

            <div className="profile-grid">

                {/* ================= LEFT SIDEBAR ================= */}
                <div className="profile-sidebar">

                    <div className="profile-card">
                        <h3 className="profile-card-title">Account Information</h3>

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
                    </div>

                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>

                    <button className="delete-btn" onClick={deleteAccount}>
                        Delete Account
                    </button>

                    {/* ===== MY ORDERS (NOW IN SIDEBAR) ===== */}
                    <div className="sidebar-orders">
                        <h3>My Orders</h3>

                        {orders.length === 0 ? (
                            <p>No orders found</p>
                        ) : (
                            <>
                                {orders.slice(0, 2).map((order) => (
                                    <div key={order._id} className="sidebar-order-card">

                                        {order.products?.[0] && (
                                            <div className="sidebar-order-product">
                                                <img
                                                    src={order.products[0].image}
                                                    alt={order.products[0].name}
                                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                                                />
                                                <div>
                                                    <div>
                                                        <p>{order.products[0].name}</p>
                                                        <p>Size: {order.products[0].size}</p>
                                                        <p>₹{order.totalAmount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="sidebar-status">
                                            {order.deliveryStatus}
                                        </p>

                                        {["Processing", "Confirmed"].includes(order.deliveryStatus) && (
                                            <button
                                                className="cancel-small-btn"
                                                onClick={() => cancelOrder(order._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    className="view-orders-btn"
                                    onClick={() => navigate("/my-orders")}
                                >
                                    View All Orders
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ================= RIGHT CONTENT ================= */}
                <div className="profile-content">

                    {/* UPDATE PROFILE */}
                    <div className="profile-section">
                        <h3>Update Profile</h3>

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <button className="primary-btn" onClick={updateProfile}>
                            Save Changes
                        </button>
                    </div>

                    {/* LOCATION */}
                    <div className="profile-section">
                        <h3>Set Location</h3>

                        <input
                            type="text"
                            placeholder="Enter city or address"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <button className="primary-btn" onClick={updateLocation}>
                            Save Location
                        </button>
                    </div>

                    {/* CHANGE PASSWORD */}
                    <div className="profile-section">
                        <h3>Change Password</h3>

                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <button className="primary-btn" onClick={updatePassword}>
                            Update Password
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;