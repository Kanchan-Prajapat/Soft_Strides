import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import { useLocation } from "react-router-dom";



const Checkout = () => {
  const { cartItems, totalPrice } = useCart();
  const location = useLocation();

  const isBuyNow = new URLSearchParams(location.search).get("type") === "buyNow";
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
const [checkoutItems, setCheckoutItems] = useState([]);
const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    phone: ""
  });

const finalAmount = checkoutTotal - discount;

  useEffect(() => {
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.get(
        `${API_URL}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const items = res.data;

      setCheckoutItems(items);

      const total = items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );

      setCheckoutTotal(total);

    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  };

  if (isBuyNow) {
    fetchCart(); // 🔥 only 1 item will come
  } else {
    setCheckoutItems(cartItems);
    setCheckoutTotal(totalPrice);
  }

}, [isBuyNow, cartItems, totalPrice, API_URL]);

  // Autofill
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  if (user) {
    setForm((prev) => ({
      ...prev,
      firstName: user.name?.split(" ")[0] || "",
      phone: user.phone || "",
      address: user.location || ""
    }));
  }
}, []); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Coupon
  const applyCoupon = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        `${API_URL}/api/coupons/apply`,
        {
          code: coupon,
          totalAmount: checkoutTotal
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setDiscount(res.data.discountAmount);
      alert("Coupon applied!");

    } catch (err) {
      alert("Invalid coupon");
      setDiscount(0);
    }
  };

  // 🔥 RAZORPAY PAYMENT
  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      if (!form.address || !form.phone) {
        alert("Fill address & phone");
        setLoading(false);
        return;
      }

      // Create order
      const orderRes = await axios.post(
        `${API_URL}/api/payments/create-order`,
        { amount: finalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const razorpayOrder = orderRes.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,
        name: "Soft Strides",
        description: "Order Payment",

        handler: async function (response) {

          const verifyRes = await axios.post(
            `${API_URL}/api/payments/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                products: checkoutItems,
                totalAmount: finalAmount,
                address: form.address,
                phone: form.phone,
                appliedCouponCode: coupon
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful 🎉");
            setStep(3);
          }
        },

        theme: {
          color: "#8E7AB5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">

      {/* STEP */}
      <div className="checkout-progress">
        <div className={step >= 1 ? "active" : ""}>Delivery</div>
        <div className={step >= 2 ? "active" : ""}>Payment</div>
        <div className={step >= 3 ? "active" : ""}>Success</div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="checkout-container">

         <div className="checkout-left">
  <div className="form-grid">

   <div className="input-group">
  <label>First Name</label>
  <input
    name="firstName"
    value={form.firstName}
    onChange={handleChange}
    placeholder="Enter First Name"
  />
</div>

<div className="input-group">
  <label>Last Name</label>
  <input
    name="lastName"
    value={form.lastName}
    onChange={handleChange}
    placeholder="Enter Last Name"
  />
</div>

<div className="input-group full">
  <label>Address</label>
  <textarea
    name="address"
    value={form.address}
    onChange={handleChange}
    placeholder="Enter full address"
  />
</div>

<div className="input-group">
  <label>City</label>
  <input
    name="city"
    value={form.city}
    onChange={handleChange}
  />
</div>

<div className="input-group">
  <label>Pincode</label>
  <input
    name="pincode"
    value={form.pincode}
    onChange={handleChange}
  />
</div>

<div className="input-group full">
  <label>Phone</label>
  <input
    name="phone"
    value={form.phone}
    onChange={handleChange}
  />
</div>

  </div>

 <button
  className="primary-btn"
  onClick={() => {
    if (!form.firstName || !form.address || !form.phone) {
      alert("Please fill all required fields");
      return;
    }
    setStep(2);
  }}
>
    Continue to Payment
  </button>

</div>

          <div className="checkout-right">
            <h3>Order Summary</h3>

           {checkoutItems.map((item) => {
  const product = item.product || item; // 🔥 important fix

  return (
    <div key={item._id} className="summary-item">
      <img
        src={product.images?.[0] || product.image}
        alt={product.name}
      />
      <div>
        <p>{product.name}</p>
        <span>
          ₹{product.price} × {item.quantity || 1}
        </span>
      </div>
    </div>
  );
})}

            <div className="coupon-box">
              <p>Have Coupen?</p>
              <p>Apply Here!</p>
              <input style={{  padding: '5px', color: '#fff', width: '100px' }} value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            <h3>Total ₹{finalAmount}</h3>
          </div>

        </div>
      )}

   {/* STEP 2 */}
{step === 2 && (
  <div className="payment-screen">
    <h2>Payment Method</h2>
    <p>Amount to be paid:</p>
    <span className="total-amount">₹{finalAmount}</span>

    <button
      onClick={handlePayment}
      className="primary-btn"
      disabled={loading}
    >
      {loading ? "Initializing Razorpay..." : "Pay Securely"}
    </button>
    
    <p style={{ fontSize: '12px', marginTop: '20px', color: '#52525b' }}>
      100% Secure Payment via Razorpay
    </p>
  </div>
)}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="success-screen">
          <h2>🎉 Order Placed Successfully!</h2>
          <button onClick={() => navigate("/my-orders")}>
            View Orders
          </button>
        </div>
      )}

    </div>
  );
};

export default Checkout;