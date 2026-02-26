

// const Checkout = () => {
//   const { cartItems, totalPrice } = useCart();
//   const navigate = useNavigate();
//   const API_URL = process.env.REACT_APP_API_URL;
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [paymentScreenshot, setPaymentScreenshot] = useState(null);
//   const [loading, setLoading] = useState(false);

//   //Coupon code states
//   const [couponCode, setCouponCode] = useState("");
//   const [discount, setDiscount] = useState(0);
// const [appliedCouponCode, setAppliedCouponCode] = useState("");


// // const loadRazorpay = () => {
// //   return new Promise((resolve) => {
// //     const script = document.createElement("script");
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.onload = () => resolve(true);
// //     script.onerror = () => resolve(false);
// //     document.body.appendChild(script);
// //   });
// // };


// const applyCoupon = async () => {
//   try {
//     const token = localStorage.getItem("userToken");

//     const res = await axios.post(
//     `${API_URL}/api/coupons/apply`,
//       {
//         code: couponCode,
//         totalAmount: totalPrice,
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
    
//     setAppliedCouponCode(couponCode);

//     setDiscount(res.data.discountAmount);
//     alert("Coupon applied successfully!");
//   } catch (err) {
//     alert(err.response?.data?.message || "Invalid coupon");
//     setDiscount(0);
//   }
// };



//   // const handlePayment = async () => {
//   // const token = localStorage.getItem("userToken");

//   // const res = await loadRazorpay();
//   // if (!res) {
//   //   alert("Razorpay SDK failed to load");
//   //   return;
//   // }

//   // const orderRes = await axios.post(
//   //   `${API_URL}/api/payments/create-order`,
//   //   { amount: totalPrice },
//   //   { headers: { Authorization: `Bearer ${token}` } }
//   // );

//   // const razorpayOrder = orderRes.data;

//   // const options = {
//   //   key: "YOUR_RAZORPAY_KEY_ID",
//   //   amount: razorpayOrder.amount,
//   //   currency: "INR",
//   //   name: "Soft Strides",
//   //   description: "Order Payment",
//   //   order_id: razorpayOrder.id,

//   //   handler: async function (response) {
//   //     const verifyRes = await axios.post(
//   //       1${API_URL}/api/payments/verify`,
//   //       {
//   //         razorpay_order_id: response.razorpay_order_id,
//   //         razorpay_payment_id: response.razorpay_payment_id,
//   //         razorpay_signature: response.razorpay_signature,
//   //         orderData: {
//   //           products: cartItems,
//   //           totalAmount: totalPrice,
//   //           address,
//   //           phone,
//   //         },
//   //       },
//   //       { headers: { Authorization: `Bearer ${token}` } }
//   //     );

//   //     if (verifyRes.data.success) {
//   //       alert("Payment successful!");
//   //       navigate("/my-orders");
//   //     }
//   //   },
//   // };

// //   const paymentObject = new window.Razorpay(options);
// //   paymentObject.open();
// // };

// const handlePayment = async () => {
//   try {
//     setLoading(true);
//     const token = localStorage.getItem("userToken");

//     if (!address || !phone) {
//       alert("Please fill address and phone");
//       return;
//     }

//     if (!paymentScreenshot) {
//       alert("Please upload payment screenshot");
//       return;
//     }

//     const formData = new FormData();

//     formData.append("products", JSON.stringify(cartItems));
//     formData.append("totalAmount", totalPrice - discount);
//     formData.append("address", address);
//     formData.append("phone", phone);
//     formData.append("appliedCouponCode", appliedCouponCode);
//     formData.append("paymentScreenshot", paymentScreenshot); // ✅ FIXED

//     await axios.post(
//       `${API_URL}/api/orders`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     alert("Order placed successfully!");
//     navigate("/my-orders");

//   } catch (error) {
//     console.error(error.response?.data || error);
//     alert(error.response?.data?.message || "Order failed");

//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="container checkout-page">
//       <h2>Checkout</h2>

//       <div className="checkout-grid">
//         <div className="checkout-form">
//           <label>Shipping Address</label>
//           <textarea
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//           />

//           <label>Phone Number</label>
//           <input
//             type="text"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />

          
//           <label>Coupon Code</label>

//          <div className="coupon-row">
//   <input
//     placeholder="Enter coupon"
//     value={couponCode}
//     onChange={(e) => setCouponCode(e.target.value)}
//   />
//   <button onClick={applyCoupon}>Apply</button>
// </div>

//           <h3>Total: ₹{totalPrice - discount}</h3>

//           {/* <button onClick={handlePayment}>
//   Pay with Razorpay
// </button> */}

//           <input
//             type="file"
//             onChange={(e) => setPaymentScreenshot(e.target.files[0])}
//           />

//           <button
//             className="btn-primary"
//             onClick={handlePayment}
//             disabled={loading}
//           >
//             {loading ? "Placing Order..." : "Place Order"}
//           </button>
//         </div>

//         <div className="checkout-summary">
//           <h3>Order Summary</h3>

//          {cartItems.map((item) => (
//   <div key={item._id} className="summary-item">
//     <img
//       src={item.images?.[0]}
//       alt={item.name}
//       className="summary-image"
//     />

//     <div className="summary-details">
//       <p className="product-name">{item.name}</p>
//       <p>Size: {item.size}</p>
//       <p>₹{item.price} × {item.qty}</p>
//     </div>
//   </div>
// ))}

//           <hr />
//           <h3>Total: ₹{totalPrice}</h3>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
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

  // 🔥 Auto-fill user saved data
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

  // 🎁 Apply Coupon (Real DB)
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
      alert("Coupon applied successfully!");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid coupon");
      setDiscount(0);
    }
  };

  // 💳 Razorpay Payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      if (!form.address || !form.phone) {
        alert("Please fill address and phone");
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        setLoading(false);
        return;
      }

      // 🔹 Create Razorpay Order
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
            setStep(3);
          }
        },

        theme: {
          color: "#ff4d4d"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-wrapper">

      {/* STEP INDICATOR */}
      <div className="checkout-progress">
        <div className={step >= 1 ? "active" : ""}>Delivery</div>
        <div className={step >= 2 ? "active" : ""}>Payment</div>
        <div className={step >= 3 ? "active" : ""}>Success</div>
      </div>

      {step === 1 && (
        <div className="checkout-container">

          {/* LEFT - DELIVERY FORM */}
          <div className="checkout-left">

            <div className="floating-group">
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
              <label>First Name</label>
            </div>

            <div className="floating-group">
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
              <label>Last Name</label>
            </div>

            <div className="floating-group">
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

            <div className="floating-group">
              <input name="phone" value={form.phone} onChange={handleChange} required />
              <label>Phone</label>
            </div>

            <button
              className="primary-btn"
              onClick={() => setStep(2)}
            >
              Continue to Payment
            </button>

          </div>

          {/* RIGHT - ORDER SUMMARY */}
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

            {/* Coupon */}
            <div className="coupon-box">
              <input
                placeholder="Enter coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            {discount > 0 && (
              <div className="discount-line">
                Discount: -₹{discount}
              </div>
            )}

            <div className="summary-total">
              <strong>Total</strong>
              <strong>₹{finalAmount}</strong>
            </div>
          </div>

        </div>
      )}

      {step === 2 && (
        <div className="payment-screen">
          <h2>Payment</h2>
          <p>Total Amount: ₹{finalAmount}</p>
          <button
            onClick={handlePayment}
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="success-screen">
          <h2>🎉 Order Placed Successfully!</h2>
          <p>Thank you for shopping with Soft Strides.</p>
          <button onClick={() => navigate("/my-orders")} className="primary-btn">
            View Orders
          </button>
        </div>
      )}

    </div>
  );
};

export default Checkout;