// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/Logo.jpg";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
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
            ["FlashSales", "/flash-sales"],
            ["Logout", "/"],
          ].map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setIsOpen(false)} // close on mobile click
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;