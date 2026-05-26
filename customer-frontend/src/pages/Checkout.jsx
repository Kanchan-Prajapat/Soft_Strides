import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import { useLocation } from "react-router-dom";
import { State, City } from "country-state-city";



const Checkout = () => {
  const {
    cartItems,
    totalPrice,
    clearCart
  } = useCart();
  const location = useLocation();

  const isBuyNow = new URLSearchParams(location.search).get("type") === "buyNow";
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [stateCode, setStateCode] = useState("");

  const states = State.getStatesOfCountry("IN");
  const cities = City.getCitiesOfState("IN", stateCode);
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    phone: ""
  });

  const handlingCharge = 5;


  // FREE DELIVERY ABOVE 699
  const deliveryCharge =
    checkoutTotal >= 699 ? 0 : 49;

  // SMALL CART FEE
  const smallCartFee =
    checkoutTotal < 699 ? 20 : 0;

  const finalAmount =

    Number(checkoutTotal || 0)
    + handlingCharge
    + deliveryCharge
    + smallCartFee
    - Number(discount || 0);


  console.log("FINAL AMOUNT:", finalAmount);
  console.log("Creating Razorpay order...");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user?.addresses) {
      setSavedAddresses(user.addresses);

      const defaultAddress =
        user.addresses.find(a => a.isDefault) || user.addresses[0];


      if (defaultAddress) {
        setForm({
          firstName: defaultAddress.name?.split(" ")[0] || "",
          lastName: "",
          address: defaultAddress.address,
          city: defaultAddress.city,
          pincode: defaultAddress.pincode,
          state: defaultAddress.state,
          phone: defaultAddress.phone
        });
      }
    }
  }, []);

  useEffect(() => {
    if (form.state) {
      const selected = states.find(s => s.name === form.state);
      if (selected) setStateCode(selected.isoCode);
    }
  }, [form.state, states]);

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

        const total = cartItems.reduce(
          (acc, item) =>
            acc + Number(item.discountPrice) * Number(item.qty || 1),
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

      const total = cartItems.reduce(
        (acc, item) =>
          acc + Number(item.discountPrice) * Number(item.qty || 1),
        0
      );

      setCheckoutTotal(total);
    }
  }, [isBuyNow, cartItems, totalPrice, API_URL]);

  // Autofill


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

  useEffect(() => {

  const fetchCoupons = async () => {
    try {

     const token = localStorage.getItem("userToken");

const { data } = await axios.get(
  `${API_URL}/api/coupons/available?totalAmount=${totalPrice}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setAvailableCoupons(data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchCoupons();

}, [totalPrice, API_URL]);

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
        prefill: {
          name:
            `${form.firstName} ${form.lastName}`,

          contact: form.phone,

          email:
            JSON.parse(
              localStorage.getItem("userInfo")
            )?.email || "",
        },

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  products: checkoutItems.map((item) => ({
                    _id: item.product?._id || item._id,

                    name: item.product?.name || item.name,

                    images:
                      item.product?.images || item.images || [],

                    image:
                      item.product?.images?.[0] ||
                      item.image,

                    discountPrice:
                      item.product?.discountPrice || item.discountPrice,

                    qty:

                      item.quantity || item.qty || 1,

                    size:
                      item.size || "Free Size",
                  })),

                  subtotal: checkoutTotal,
                  handlingCharge,
                  deliveryCharge,
                  smallCartFee,
                  discountAmount: discount,

                  totalAmount: finalAmount,
                  address: form.address,
                  phone: form.phone,
                  state: form.state,
                  city: form.city,
                  pincode: form.pincode,
                  appliedCouponCode: coupon
                }
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("VERIFY RESPONSE:", verifyRes.data);

            if (verifyRes.data.success) {
              alert("Payment Successful 🎉");
              clearCart();

              // 🔥 IMPORTANT
              setStep(3);

              // 🔥 REDIRECT AFTER SMALL DELAY
              setTimeout(() => {
                navigate("/checkout/order-success");
              }, 1000);
            } else {
              alert("Payment verification failed");
            }

          } catch (error) {
            console.error("VERIFY ERROR:", error);
            alert("Payment verification error ❌");

            // 🔥 fallback redirect
            navigate("/checkout/order-success");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
            setLoading(false);
          }
        },

        theme: {
          color: "#8E7AB5"
        },
        retry: {
          enabled: true,
          max_count: 2,
        },
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
                <label>Select Saved Address</label>

                <select className="custom-select"
                  onChange={(e) => {
                    const selected = savedAddresses[e.target.value];

                    if (!selected) return;

                    const selectedState = states.find(
                      (s) => s.name === selected.state
                    );

                    if (selectedState) {
                      setStateCode(selectedState.isoCode);
                    }

                    setForm({
                      firstName: selected.name?.split(" ")[0] || "",
                      lastName: "",
                      address: selected.address,
                      city: selected.city,
                      pincode: selected.pincode,
                      state: selected.state,
                      phone: selected.phone
                    });
                  }}
                >
                  <option value="">Select Address</option>

                  {savedAddresses.map((addr, index) => (
                    <option key={index} value={index}>
                      {addr.name} - {addr.address} ({addr.city})
                    </option>
                  ))}
                </select>
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
                <label>State</label>
                <select
                  value={stateCode}
                  onChange={(e) => {
                    const selected = states.find(s => s.isoCode === e.target.value);

                    setStateCode(selected.isoCode);

                    setForm({
                      ...form,
                      state: selected.name,
                      city: ""
                    });
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>City</label>
                <select
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  disabled={!stateCode}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
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

            {checkoutItems.map((item, index) => {
              const product = item.product || item; // 🔥 important fix

              return (
                <div key={`${item._id}-${item.size}-${index}`} className="summary-item">
                  <div className="premium-image-wrapper square" style={{ width: 64, minWidth: 64 }}>
                    <img src={product.images?.[0] || product.image} alt={product.name} className="premium-image" />
                  </div>
                  <div>
                    <p>{product.name}</p>
                    <span>
                      ₹{product.discountPrice} × {item.quantity || item.qty || 1}
                    </span>
                  </div>
                </div>
              );
            })}

            {availableCoupons.length > 0 && (
  <div className="available-offers">

    <h4>🎁 Available Offers</h4>

  {availableCoupons.map((item) => (

  <div
    className={`offer-item ${
      coupon === item.code
        ? "active-offer"
        : ""
    }`}
    key={item._id}

    onClick={() => setCoupon(item.code)}
  >
    <strong>{item.code}</strong>

    {" - "}

    {item.discount}% OFF above ₹{item.minAmount}

  </div>

))}

  </div>
)}

            <div className="coupon-box">
              <p>Have Coupon?</p>
              <p>Apply Here!</p>
              <input style={{ padding: '5px', color: '#fff', width: '100px' }} value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={applyCoupon}>Apply</button>
            </div>

            <div className="price-summary">

              {/* MRP */}
              <p>
                MRP
                <span>₹{checkoutTotal}</span>
              </p>

              {/* Handling */}
              <p>
                Handling Charge
                <span>₹{handlingCharge}</span>
              </p>

              {/* Small Cart */}
              {smallCartFee > 0 && (
                <p>
                  Small Cart Fee
                  <span>₹{smallCartFee}</span>
                </p>
              )}

              {/* Shipping */}
              <p>
                Delivery Charges
                <span>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </span>
              </p>

              {/* Discount */}
              {discount > 0 && (
                <p className="discount-line">
                  Discount
                   <p>Coupon Applied</p>
                  <span>-₹{discount}</span>
                 
                </p>
              )}

              <hr />

              {/* TOTAL */}
              <h3>
                Bill Total
                <span>₹{finalAmount}</span>
              </h3>

            </div>
          </div>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="payment-screen">
          <h2>Payment Method</h2>
          <p>Amount to be paid:</p>
          <span className="total-amount">₹{finalAmount}</span>

          {/* <button
  onClick={() => navigate("/checkout/order-success")}
>
  Test Success Page
</button> */}

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