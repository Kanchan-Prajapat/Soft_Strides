import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =================================
   CREATE RAZORPAY ORDER
================================= */
// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ message: "Amount required" });
//     }

//     const options = {
//       amount: amount * 100, // Razorpay works in paisa
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);

//     res.json(order);
//   } catch (error) {
//     console.error("RAZORPAY CREATE ORDER ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

//this is tempp
export const createRazorpayOrder = async (req, res) => {
  res.json({
    id: "fake_order_id_123",
    amount: req.body.amount,
    currency: "INR",
  });
};


/* =================================
   VERIFY PAYMENT
================================= */
// export const verifyRazorpayPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generatedSignature === razorpay_signature) {
//       return res.json({ success: true });
//     } else {
//       return res.status(400).json({ success: false });
//     }
//   } catch (error) {
//     console.error("VERIFY ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


//this is also temp
export const verifyRazorpayPayment = async (req, res) => {
  res.json({ success: true });
};
