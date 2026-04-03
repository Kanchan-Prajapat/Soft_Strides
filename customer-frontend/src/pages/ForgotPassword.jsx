import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import logo from "../assets/Logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
const [password, setPassword] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API_URL}/api/auth/forgot-password`,
      { email }
    );

    alert("OTP: " + res.data.otp); // dev only
    setStep(2);

  } catch (err) {
    setMessage(err.response?.data?.message || "Something went wrong");
  }
};


const handleReset = async () => {
  try {
  const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
  email,
  otp,
  password,
});

// 🔥 AUTO LOGIN
localStorage.setItem("userToken", res.data.token);
localStorage.setItem("userInfo", JSON.stringify(res.data.user));

window.location.href = "/";

    alert("Password reset successful ✅");
  

  } catch (err) {
    alert(err.response?.data?.message || "Reset failed");
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

      {step === 2 && (
  <>
    <input
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />

    <input
      type="password"
      placeholder="New Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      className="auth-btn"
      onClick={handleReset}
    >
      RESET PASSWORD
    </button>
    
  </>
)}


           </form>
           {message && (
  <p style={{ color: "#ff4d4d", marginTop: "10px" }}>
    {message}
  </p>
)}
      </div>
    </div>
  );
};

export default ForgotPassword;