import { useNavigate, useLocation } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/Logo.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const from = location.state?.from?.pathname || "/";
 const { login } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <img src={logo} alt="Soft Strides" className="auth-logo" />

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login with Google</p>

        {/* 🔥 GOOGLE LOGIN */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post(
                  `${API_URL}/api/auth/google`,
                  {
                    token: credentialResponse.credential,
                  }
                );

               login(res.data.user, res.data.token);
navigate(from, { replace: true });
              } catch (err) {
                alert("Google login failed");
              }
            }}
            onError={() => alert("Google Login Error")}
          />
        </div>

        <p
          className="auth-link"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </p>

        <button
          className="skip-btn"
          onClick={() => navigate("/")}
        >
          Continue Without Login
        </button>

      </div>
    </div>
  );
};

export default Login;