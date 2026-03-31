import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import logo from "../assets/Logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API_URL}/api/auth/forgot-password`,
      { email }
    );

    console.log("API RESPONSE:", res.data); // 🔥 DEBUG

    const token = res.data.resetToken;

    if (!token) {
      setMessage("Error: Token not received");
      return;
    }

    const resetLink = `${window.location.origin}/reset-password/${token}`;
    setMessage(resetLink);

  } catch (err) {
    setMessage(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <img src={logo} alt="Soft Strides" className="auth-logo" />
        <h2 className="auth-title">FORGOT PASSWORD</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn">SEND RESET LINK</button>

       {message && (
  <a
    href={message}
    style={{ color: "#ff4d4d", display: "block", marginTop: "15px" }}
  >
    Click here to reset password
  </a>
)}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;