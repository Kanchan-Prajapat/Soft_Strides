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

 setMessage(
  `Reset link: http://localhost:3000/reset-password/${res.data.resetToken}`
);
      console.log("Reset Token:", res.data.resetToken);
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
    href={message.split("Reset link: ")[1]}
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