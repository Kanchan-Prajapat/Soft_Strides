import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import { createShipment } from "../services/shiprocketService.js";

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


/* =========================
   CREATE ORDER
========================= */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* =========================
   VERIFY PAYMENT
========================= */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    const detailedProducts = orderData.products.map(item => {
  const product = item.product || item;

  return {
    product: product._id,
    name: product.name,
    image: product.images?.[0] || product.image,
    price: product.price,
    qty: item.quantity || item.qty || 1,
    size: item.size || "Free Size"
  };
});

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

  const trackingId =
  "SS" + Math.random().toString(36).substring(2, 10).toUpperCase();

const order = await Order.create({
  user: req.user._id,
  products: detailedProducts,
  totalAmount: orderData.totalAmount,

  address: orderData.address,
  phone: orderData.phone,

  city: orderData.city,
  state: orderData.state,
  pincode: orderData.pincode,

  trackingId,

  paymentStatus: "Paid",
  paymentId: razorpay_payment_id,

  deliveryStatus: "Confirmed",

  history: [
    {
      status: "Order Placed",
      type: "delivery",
      date: new Date(),
    },
    {
      status: "Confirmed",
      type: "delivery",
      date: new Date(),
    },
  ],
});

if (!order.awbCode) {
  try {
    const shipment = await createShipment(order);

    order.awbCode = shipment.awb_code;

    await order.save();
  } catch (err) {
    console.error("Shiprocket error:", err);
  }
}

    res.json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ update status
    order.deliveryStatus = status;
    

    // ✅ push into history (ONLY if not duplicate)
    const lastStatus = order.history[order.history.length - 1]?.status;

    if (lastStatus !== status) {
      order.history.push({
        status,
        type: "delivery",
        date: new Date(),
      });
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};