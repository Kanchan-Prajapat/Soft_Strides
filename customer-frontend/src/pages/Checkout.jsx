import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css"

const Checkout = () => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  //Coupon code states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
const [appliedCouponCode, setAppliedCouponCode] = useState("");


// const loadRazorpay = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };


const applyCoupon = async () => {
  try {
    const token = localStorage.getItem("userToken");

    const res = await axios.post(
    `${API_URL}/api/coupons/apply`,
      {
        code: couponCode,
        totalAmount: totalPrice,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    setAppliedCouponCode(couponCode);

    setDiscount(res.data.discountAmount);
    alert("Coupon applied successfully!");
  } catch (err) {
    alert(err.response?.data?.message || "Invalid coupon");
    setDiscount(0);
  }
};



  // const handlePayment = async () => {
  // const token = localStorage.getItem("userToken");

  // const res = await loadRazorpay();
  // if (!res) {
  //   alert("Razorpay SDK failed to load");
  //   return;
  // }

  // const orderRes = await axios.post(
  //   `${API_URL}/api/payments/create-order`,
  //   { amount: totalPrice },
  //   { headers: { Authorization: `Bearer ${token}` } }
  // );

  // const razorpayOrder = orderRes.data;

  // const options = {
  //   key: "YOUR_RAZORPAY_KEY_ID",
  //   amount: razorpayOrder.amount,
  //   currency: "INR",
  //   name: "Soft Strides",
  //   description: "Order Payment",
  //   order_id: razorpayOrder.id,

  //   handler: async function (response) {
  //     const verifyRes = await axios.post(
  //       1${API_URL}/api/payments/verify`,
  //       {
  //         razorpay_order_id: response.razorpay_order_id,
  //         razorpay_payment_id: response.razorpay_payment_id,
  //         razorpay_signature: response.razorpay_signature,
  //         orderData: {
  //           products: cartItems,
  //           totalAmount: totalPrice,
  //           address,
  //           phone,
  //         },
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (verifyRes.data.success) {
  //       alert("Payment successful!");
  //       navigate("/my-orders");
  //     }
  //   },
  // };

//   const paymentObject = new window.Razorpay(options);
//   paymentObject.open();
// };

const handlePayment = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("userToken");

    if (!address || !phone) {
      alert("Please fill address and phone");
      return;
    }

    if (!paymentScreenshot) {
      alert("Please upload payment screenshot");
      return;
    }

    const formData = new FormData();

    formData.append("products", JSON.stringify(cartItems));
    formData.append("totalAmount", totalPrice - discount);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("appliedCouponCode", appliedCouponCode);
    formData.append("paymentScreenshot", paymentScreenshot); // ✅ FIXED

    await axios.post(
      `${API_URL}/api/orders`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Order placed successfully!");
    navigate("/my-orders");

  } catch (error) {
    console.error(error.response?.data || error);
    alert(error.response?.data?.message || "Order failed");

  } finally {
    setLoading(false);
  }
};



  return (
    <div className="container checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-grid">
        <div className="checkout-form">
          <label>Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          
          <label>Coupon Code</label>

         <div className="coupon-row">
  <input
    placeholder="Enter coupon"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
  />
  <button onClick={applyCoupon}>Apply</button>
</div>

          <h3>Total: ₹{totalPrice - discount}</h3>

          {/* <button onClick={handlePayment}>
  Pay with Razorpay
</button> */}

          <input
            type="file"
            onChange={(e) => setPaymentScreenshot(e.target.files[0])}
          />

          <button
            className="btn-primary"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>

         {cartItems.map((item) => (
  <div key={item._id} className="summary-item">
    <img
      src={item.images?.[0]}
      alt={item.name}
      className="summary-image"
    />

    <div className="summary-details">
      <p className="product-name">{item.name}</p>
      <p>Size: {item.size}</p>
      <p>₹{item.price} × {item.qty}</p>
    </div>
  </div>
))}

          <hr />
          <h3>Total: ₹{totalPrice}</h3>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
