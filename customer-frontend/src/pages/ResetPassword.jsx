import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import logo from "../assets/Logo.jpg";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

 const handleReset = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API_URL}/api/auth/reset-password/${token}`,
      { password }
    );

    // ✅ Auto login after reset
    localStorage.setItem("userToken", res.data.token);
    localStorage.setItem(
      "userInfo",
      JSON.stringify(res.data.user)
    );
    console.log("RESET RESPONSE:", res.data);

    navigate("/");

  } catch (err) {
    setMessage(
      err.response?.data?.message || "Reset failed"
    );
  }
};

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <img src={logo} alt="Soft Strides" className="auth-logo" />
        <h2 className="auth-title">RESET PASSWORD</h2>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <input
              type="password"
              placeholder="NEW PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn">
            RESET PASSWORD
          </button>

          {message && (
            <p style={{ marginTop: "15px", color: "#ff4d4d" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;