import "../styles/navbar.css";
import logo from "../assets/Logo.png";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import avatar from "../pages/default-avtar.png";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faHouse,
  faUser,
  faBox
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
 

  // 🔥 Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  // 🔥 Close menu on route change (clean UX)
  const handleClose = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">

        {/* TOP ROW */}
        <div className="nav-top">

          {/* LOGO */}
          <div className="nav-left">
            <Link to="/" onClick={handleClose}>
              <img src={logo} alt="SoftStrides" className="logo-image" />
            </Link>
          </div>

          {/* DESKTOP ICONS */}
          <div className="nav-right desktop-only">
            <Link to="/" className="nav-icon">
              <FontAwesomeIcon icon={faHouse} />
            </Link>

            <Link  to={user ? "/cart" : "/login"} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </Link>

           {user && (
  <Link to="/my-orders" className="nav-icon">
    <FontAwesomeIcon icon={faBox} />
  </Link>
)}

            <Link  to={user ? "/wishlist" : "/login"} className="nav-icon">
              <FontAwesomeIcon icon={faHeart} />
            </Link>

            <Link  to={user ? "/profile" : "/login"}>
              <img
                src={user?.profileImage || avatar}
                alt="Profile"
                className="nav-avatar"
              />
            </Link>
          </div>

          {/* MOBILE MENU ICON */}
          <div
            className="mobile-menu-icon"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </div>

        </div>

        {/* SEARCH */}
        <div className="nav-center">
          <SearchBar />
        </div>

      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        {/* HEADER */}
        <div className="menu-header">
          <img src={logo} alt="logo" className="menu-logo" />
          <span onClick={handleClose}>✕</span>
        </div>

        {/* LINKS */}
        <Link to="/" onClick={handleClose}>
          <FontAwesomeIcon icon={faHouse} /> Home
        </Link>

        <Link  to={user ? "/cart" : "/login"} onClick={handleClose}>
          <FontAwesomeIcon icon={faShoppingCart} /> Cart
        </Link>
{user && (
  <Link to="/my-orders" onClick={handleClose}>
    <FontAwesomeIcon icon={faBox} /> My Orders
  </Link>
)}

        <Link  to={user ? "/wishlist" : "/login"} onClick={handleClose}>
          <FontAwesomeIcon icon={faHeart} /> Wishlist
        </Link>

        <Link  to={user ? "/profile" : "/login"} onClick={handleClose}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </Link>

      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="menu-overlay" onClick={handleClose} />
      )}
    </>
  );
};

export default Navbar;