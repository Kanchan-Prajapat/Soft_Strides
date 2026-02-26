import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";
import logo from "../assets/Logo.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${API_URL}/api/auth/register`,
      { name, email, password }
    );

    // ✅ Save token
    localStorage.setItem("userToken", res.data.token);

    // ✅ Save user info
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      })
    );

    navigate("/");
    console.log("REGISTER RESPONSE:", res.data);

  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="auth-wrapper">
      <div className="auth-box">
      <img src={logo} alt="Soft Strides" className="auth-logo" />
        <h2 className="auth-title">REGISTER</h2>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="FULL NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button className="auth-btn">REGISTER</button>
        </form>
      </div>
    </div>
  );
};

export default Register;