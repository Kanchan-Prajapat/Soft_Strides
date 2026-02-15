// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/Logo.jpg"; // use your attached logo

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="SoftStride" />
      </div>

      <nav className="nav">
        {[
          ["Dashboard", "/dashboard"],
          ["Orders", "/orders"],
          ["Products", "/products"],
          ["Customers", "/customers"],
          ["Categories", "/categories"],
          ["Payments", "/payments"],
          ["Settings", "/settings"],
          ["Reviews", "/reviews"],
          ["Banners", "/banners"],
          ["Coupons", "/coupons"],
          ["Cancelled", "/cancelled"],
          ["Returned", "/returned"],
          ["Rejected", "/rejected"],
          ["Logout", "/"]
        ].map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* <button
        className="logout"
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        }}
      >
        Logout
      </button> */}
    </aside>
  );
};

export default Sidebar;
