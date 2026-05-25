import { useCart } from "../context/CartContext";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";


const CartDrawer = ({ open, onClose }) => {
  const { cartItems, totalPrice } = useCart();
    const navigate = useNavigate();

  return (
    <div className={`drawer-overlay ${open ? "show" : ""}`}>
     <div className="drawer">

  {/* HEADER */}
  <div className="drawer-header">
    <h3>Your Cart</h3>
     <button className="close-btn" onClick={onClose}>✕</button>
  </div>

  {/* SCROLL AREA */}
  <div className="drawer-items">
    {cartItems.map((item, index) => (
      <div key={`${item._id}-${item.size}-${index}`} className="drawer-item">
        <div className="premium-image-wrapper square" style={{ width: 70, minWidth: 70 }}>
          <img src={item.images?.[0]} alt={item.name || "product"} className="premium-image" />
        </div>
        <div>
          <h4>{item.name}</h4>
          <p>Size: {item.size}</p>
          <p>Qty: {item.qty}</p>
          <p>₹{item.discountPrice}</p>
        </div>
      </div>
    ))}
  </div>

  {/* FIXED FOOTER */}
  <div className="drawer-footer">
    <h4>Total: ₹{totalPrice}</h4>
    <button className="checkout-btn"   onClick={() => navigate("/checkout")}>Checkout</button>
  </div>

</div>
    </div>
  );
};

export default CartDrawer;