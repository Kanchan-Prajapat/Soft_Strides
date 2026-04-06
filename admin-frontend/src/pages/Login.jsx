// import { useState } from "react";
// import API from "../api/api";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "../components/Toast";
// import logo from "../assets/Logo.jpg";
// import "./Login.css";
// import "../styles/theme.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       showToast("Enter email and password", "error");
//       return;
//     }

//     try {
//       const res = await API.post("/auth/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("adminToken", res.data.token);

//       showToast("Login successful", "success");

//       navigate("/dashboard");
//     } catch (err) {
//       showToast("Invalid credentials", "error");
//     }
//   };

//   return (
//     <div className="login-wrap">
//       <form className="login-card" onSubmit={handleLogin}>
//         <img src={logo} alt="SoftStride" className="login-logo" />

//         <h2>Admin Login</h2>
//         <p className="sub">Sign in to manage SoftStride</p>

//         <input
//           className="input"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="input"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="btn" type="submit" style={{ marginTop: 16 }}>
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


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

      localStorage.setItem("adminToken", res.data.token);
localStorage.setItem("adminInfo", JSON.stringify(res.data.user));
if (!res.data.user) {
  console.log("USER NOT FOUND");
  return;
}

console.log("EMAIL FROM GOOGLE:", email);
console.log("USER FROM DB:", user);

      showToast("Admin login successful", "success");
      navigate("/dashboard");

    } catch (err) {
      showToast(
        err.response?.data?.message || "Access denied",
        "error"
      );
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