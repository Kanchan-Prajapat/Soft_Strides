import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/Toast";
import logo from "../assets/Logo.jpg";
import "./Login.css";
import "../styles/theme.css";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await API.post("/auth/admin/google", {
      token: credentialResponse.credential,
    });

    console.log("RESPONSE:", res.data);

    localStorage.setItem("token", res.data.token);
localStorage.setItem("adminInfo", JSON.stringify(res.data.user));

   
    window.location.href = "/dashboard";

  } catch (err) {
    showToast(err.response?.data?.message || "Access denied", "error");
  }
};

  return (
    <div className="login-wrap">
      <div className="login-card">
        <img src={logo} alt="SoftStride" className="login-logo" />

        <h2>Admin Login</h2>


        {/* 🔥 GOOGLE BUTTON CENTER */}
        <div style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center"
        }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => showToast("Google Login Failed", "error")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;