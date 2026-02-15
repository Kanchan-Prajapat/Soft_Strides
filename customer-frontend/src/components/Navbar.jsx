import "../styles/navbar.css";
import logo from "../assets/Logo.jpg";
import { useCart } from "../context/CartContext";
import "../styles/global.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
  setIsLoggedIn(false);
  navigate("/");
};


  return (
    <nav className="navbar">
      <Link to="/" className="logo"> <img src={logo} alt="SoftStrides Logo" className="logo-image" /></Link>
      <Link to="/cart">Cart ({cartItems.length})</Link>

      {isLoggedIn ? (
        <>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/wishlist">Wishlist </Link>

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
