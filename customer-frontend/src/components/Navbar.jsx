import "../styles/navbar.css";
import logo from "../assets/Logo.jpg";
import { useCart } from "../context/CartContext";
import "../styles/global.css";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import avatar from "../pages/default-avtar.png";

const Navbar = () => {

  const { cartItems } = useCart();
  const { user } = useAuth();

  // useEffect(() => {
  //   const token = localStorage.getItem("userToken");
  //   setIsLoggedIn(!!token);
  // }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("userToken");
  //   localStorage.removeItem("userInfo");
  //   setIsLoggedIn(false);
  //   navigate("/");
  // };


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
         <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartItems.length})</Link>
        <Link to="/wishlist">Wishlist</Link>
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
