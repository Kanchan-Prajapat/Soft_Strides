// src/components/AdminSettingsModal.jsx
import { useState } from "react";

const AdminSettingsModal = ({ admin, onClose, onUpdated }) => {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(admin.name || "");
  const [email, setEmail] = useState(admin.email || "");
  const [contact, setContact] = useState(admin.contact || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [image, setImage] = useState(null);


  const token = localStorage.getItem("adminToken");

  const saveProfile = async () => {
    const res = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {    
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, contact }),
    });

    const data = await res.json();
    onUpdated(data.admin);
    onClose();
  };

  const changePassword = async () => {
    const res = await fetch(
      "http://localhost:5000/api/users/change-password",
      {
        method: "PUT",
        headers: {
            "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPass,
          newPassword: newPass,
        }),
      }
    );

    if (!res.ok) {
      alert("Wrong old password");
      return;
    }

    alert("Password changed successfully");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setTab("profile")}>Profile</button>
          <button onClick={() => setTab("password")}>Password</button>
        </div>

        {tab === "profile" && (
          <>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
            <input value={email} onChange={e => setEmail(e.target.value)}  />
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact Number" />
            <input value={admin.role} readOnly />
            <button onClick={saveProfile}>Save</button>
          </>
        )}

        {tab === "password" && (
          <>
            <input
              placeholder="Old password"
              onChange={e => setOldPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              onChange={e => setNewPass(e.target.value)}
            />
            <button onClick={changePassword}>Change</button>
          </>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
