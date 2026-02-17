import "../styles/navbar.css";
import logo from "../assets/Logo.jpg";
import { useCart } from "../context/CartContext";
import "../styles/global.css";
import SearchBar from "./SearchBar";
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
  <div className="nav-left">
    <Link to="/">
      <img src={logo} alt="SoftStrides" className="logo-image" />
    </Link>
  </div>

  <div className="nav-center">
    <SearchBar />
  </div>

  <div className="nav-right">
    <Link to="/cart">Cart ({cartItems.length})</Link>
    <Link to="/wishlist">Wishlist</Link>

    {isLoggedIn ? (
      <button className="logout" onClick={handleLogout}>Logout</button>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </div>
</nav>

  );
};

export default Navbar;
