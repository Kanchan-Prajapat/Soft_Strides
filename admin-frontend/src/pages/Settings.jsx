import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { getMe, updateProfile, changePassword } from "../api/users";
import { useToast } from "../components/Toast";
import "../styles/theme.css";
import "./Settings.css";

const Settings = () => {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMe();
        setAdmin(data);
        setName(data.name);
        setEmail(data.email);
      } catch {
        showToast("Failed to load profile", "error");
      }
    };

    load();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const updated = await updateProfile({ name, email });
      setAdmin(updated);
      showToast("Profile updated successfully", "success");
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword({
        oldPassword: currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      showToast("Password updated successfully", "success");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Password update failed",
        "error"
      );
    }
  };

  if (!admin) return null;

  return (
    <PageLayout title="Settings">
      <div className="settings-grid">

        {/* PROFILE CARD */}
        <div className="card settings-card">
          <h3>Profile</h3>

          <div className="form-group">
            <label>Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handleProfileUpdate}>
            Save Changes
          </button>
        </div>

        {/* ACCOUNT CARD */}
        <div className="card settings-card">
          <h3>Account</h3>

          <div className="form-group">
            <label>Current Password</label>
            <input
              className="input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button className="btn" onClick={handlePasswordChange}>
            Update Password
          </button>

          <div className="divider" />

          <button
            className="danger-btn"
            onClick={() => {
              localStorage.removeItem("adminToken");
              window.location.href = "/admin/login";
            }}
          >
            Sign Out
          </button>
        </div>

      </div>
    </PageLayout>
  );
};

export default Settings;
