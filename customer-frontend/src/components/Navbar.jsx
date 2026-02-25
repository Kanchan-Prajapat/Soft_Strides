import "../styles/navbar.css";
import logo from "../assets/Logo.jpg";
import { useCart } from "../context/CartContext";
import "../styles/global.css";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import avatar from "../pages/default-avtar.png";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faHouse } from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();

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
   <Link to="/" className="nav-icon">
  <FontAwesomeIcon icon={faHouse} />
</Link>

        {/* 🛒 Cart Icon */}
        <Link to="/cart" className="nav-icon">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartItems.length > 0 && (
            <span className="cart-badge">
              {cartItems.length}
            </span>
          )}
        </Link>

        {/* ❤️ Wishlist Icon */}
        <Link to="/wishlist" className="nav-icon">
          <FontAwesomeIcon icon={faHeart} />
        </Link>

        <Link to="/profile" className="nav-profile">
          <img
            src={user?.profileImage || avatar}
            alt="Profile"
            className="nav-avatar"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;