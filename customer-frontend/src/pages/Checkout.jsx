import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

const Checkout = () => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

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

  const finalAmount = totalPrice - discount;

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
          totalAmount: totalPrice
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
                products: cartItems,
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

    <div className="floating-group">
      <input name="firstName" value={form.firstName} onChange={handleChange} required />
      <label>First Name</label>
    </div>

    <div className="floating-group">
      <input name="lastName" value={form.lastName} onChange={handleChange} required />
      <label>Last Name</label>
    </div>

    <div className="floating-group full">
      <textarea name="address" value={form.address} onChange={handleChange} required />
      <label>Address</label>
    </div>

    <div className="floating-group">
      <input name="city" value={form.city} onChange={handleChange} required />
      <label>City</label>
    </div>

    <div className="floating-group">
      <input name="pincode" value={form.pincode} onChange={handleChange} required />
      <label>Pincode</label>
    </div>

    <div className="floating-group full">
      <input name="phone" value={form.phone} onChange={handleChange} required />
      <label>Phone</label>
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

            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <img src={item.images?.[0]} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>₹{item.price} × {item.qty}</span>
                </div>
              </div>
            ))}

            <div className="coupon-box">
              <p>Have Coupen?</p>
              <p>Apply Here!</p>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            <h3>Total ₹{finalAmount}</h3>
          </div>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="payment-screen">
          <h2>Payment</h2>
          <p>Total ₹{finalAmount}</p>

          <button
            onClick={handlePayment}
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
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