// src/components/ChangePasswordModal.jsx
import { useState } from "react";
import { changeAdminPassword } from "../api/users";
import { useToast } from "../context/ToastContext";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();
showToast("Password updated", "success");

  const handleSubmit = async () => {
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await changeAdminPassword({ oldPassword, newPassword });
      alert("Password updated successfully");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Change Password</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <div style={{ marginTop: 12 }}>
          <button className="view-btn" onClick={handleSubmit}>
            Save
          </button>
          <button
            className="view-btn"
            style={{ marginLeft: 8 }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
