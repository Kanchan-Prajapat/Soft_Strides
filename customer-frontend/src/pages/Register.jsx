import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import logo from "../assets/Logo.png";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useLocation } from "react-router-dom";




const Register = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
    const location = useLocation();
 const from = location.state?.from?.pathname || "/";

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <img src={logo} alt="Soft Strides" className="auth-logo" />

        <h2 className="auth-title">Join Soft Strides</h2>
        <p className="auth-subtitle">Create your perfect fit</p>

        {/* 🔥 GOOGLE ONLY */}
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

                localStorage.setItem("userToken", res.data.token);
                localStorage.setItem(
                  "userInfo",
                  JSON.stringify(res.data.user)
                );

              navigate(from, { replace: true });
              } catch (err) {
                alert("Google signup failed");
              }
            }}
            onError={() => alert("Google Login Error")}
          />
        </div>

        <p
          className="auth-link"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Register;