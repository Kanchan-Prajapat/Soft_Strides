import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/auth.css";
import logo from "../assets/Logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
const [password, setPassword] = useState("");
const [timer, setTimer] = useState(60);
const [canResend, setCanResend] = useState(false);

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

useEffect(() => {
  if (timer > 0) {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  } else {
    setCanResend(true);
  }
}, [timer]);

const handleResendOtp = async () => {
  try {
    const res = await axios.post(
      `${API_URL}/api/auth/forgot-password`, // register me अलग route use होगा
      { email }
    );

    alert("New OTP: " + res.data.otp); // dev only

    setTimer(60);
    setCanResend(false);

  } catch (err) {
    alert("Failed to resend OTP");
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
    <div style={{ marginTop: "10px", textAlign: "center" }}>
  {canResend ? (
    <span
      onClick={handleResendOtp}
      style={{
        color: "#9b7bff",
        cursor: "pointer",
        fontWeight: "500",
      }}
    >
      Resend OTP
    </span>
  ) : (
    <span style={{ color: "#aaa" }}>
      Resend in {timer}s
    </span>
  )}
</div>

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
)}setTimer(60);
setCanResend(false);


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