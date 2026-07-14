//controllers/orderController.js
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import { createShipment, trackShipment } from "../services/shiprocketService.js";

/* =============================
   CREATE ORDER
============================= */
const trackingId =
  "SS" + Math.random().toString(36).substring(2, 10).toUpperCase();

export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }
   

    const {
      products,
      totalAmount,

      subtotal,
      handlingCharge,
      deliveryCharge,
      smallCartFee,
      discountAmount: frontendDiscount,

      address,
      phone,
      city,
      state,
      pincode,

      appliedCouponCode,
      paymentMethod,
    } = req.body;

    const parsedProducts = JSON.parse(products);

    const detailedProducts = [];

    for (const item of parsedProducts) {
      const productId = item.product || item._id;

      const product = await Product.findById(productId);

      if (!product) continue;

      detailedProducts.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || null,
        price: product.discountPrice,
        qty: item.qty,
        size: item.size,
      });
    }
    let finalAmount = Number(totalAmount);
    

    /* =============================
       COUPON VALIDATION
    ============================= */

    if (appliedCouponCode) {
  const coupon = await Coupon.findOne({
    code: appliedCouponCode.toUpperCase(),
    isActive: true,
  });

  if (!coupon)
    return res.status(400).json({
      message: "Invalid coupon",
    });

  if (new Date() > coupon.expiryDate)
    return res.status(400).json({
      message: "Coupon expired",
    });

  if (coupon.usedBy.includes(req.user._id))
    return res.status(400).json({
      message: "Coupon already used",
    });

  await Coupon.findOneAndUpdate(
    { code: appliedCouponCode.toUpperCase() },
    {
      $push: { usedBy: req.user._id },
    }
  );
}
      discountAmount = (finalAmount * coupon.discount) / 100;
      finalAmount -= discountAmount;


    /* =============================
       UPLOAD SCREENSHOT
    ============================= */

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "softstrides/payments" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadedImage = await uploadStream();

    /* =============================
       GENERATE TRACKING DATA
    ============================= */

    const trackingId =
      "SS" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const estimatedDelivery = new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    );

    /* =============================
       CREATE ORDER
    ============================= */

    const order = await Order.create({
      user: req.user._id,
      products: detailedProducts,
      totalAmount: finalAmount,
      appliedCouponCode: appliedCouponCode || null,
      address,
      phone,
      paymentScreenshot: uploadedImage.secure_url,
      trackingId,
      subtotal,
      handlingCharge,
      deliveryCharge,
      smallCartFee,
      discountAmount,

      deliveryStatus: "Pending",
      estimatedDelivery,
      history: [
        {
          status: "Pending",
          type: "delivery",
          date: new Date(),
        },
      ],

    });

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   USER ORDERS
============================= */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: "products.product",
      select: "name images price"
    })
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* =============================
   ADMIN - ALL ORDERS
============================= */
export const getAllOrders = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type === "cancelled") {
      filter.isCancelled = true;
    }

    if (type === "returned") {
      filter.deliveryStatus = {
        $in: [
          "Return Requested",
          "Return Approved",
          "Pickup Scheduled",
          "Picked Up",
          "Returned",
          "Refund Processed",
          "Refund Completed"
        ]
      };
    }

    if (type === "rejected") {
      filter.deliveryStatus = {
        $in: ["Return Rejected", "Cancelled"]
      };
    }


    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   SINGLE ORDER DETAILS
============================= */
export const getSingleOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.product",
        select: "name images price"
      });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);

  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

/* =============================
   UPDATE PAYMENT STATUS
============================= */
export const updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.paymentStatus = status;
  await order.save();

  res.json(order);
};

/* =============================
   UPDATE DELIVERY STATUS
============================= */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = status;

    // 🧠 TRACK HISTORY
    const lastStatus = order.history.at(-1)?.status;

    if (lastStatus !== status) {
      order.history.push({
        status,
        type: "delivery",
        date: new Date(),
      });
    }

    // 🚚 IF CONFIRMED → CREATE SHIPMENT
    if (status === "Confirmed" && !order.awbCode) {
      try {
        const shipment = await createShipment(order);

        order.awbCode = shipment.awb_code;

        console.log("Shipment created:", shipment);
      } catch (err) {
        console.error("Shiprocket error:", err.response?.data || err.message);
      }
    }

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.trackingId) {
      return res.status(404).json({ message: "No tracking ID" });
    }

    const data = await trackShipment(order.awbCode);

    const tracking = data.tracking_data.shipment_track;

    order.history = tracking.map((item) => ({
      status: item.current_status,
      type: "delivery",
      date: new Date(item.updated_date),
    }));

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.awbCode) {
      return res.status(404).json({ message: "No tracking available" });
    }

    const data = await trackShipment(order.awbCode);

    const tracking = data.tracking_data?.shipment_track || [];

    // 🔥 Convert Shiprocket → your timeline
    const history = tracking.map((item) => ({
      status: item.current_status || item.status,
      type: "delivery",
      date: new Date(item.updated_date || item.date),
    }));

    order.history = history;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ message: "Tracking failed" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return res.status(400).json({
        message: "Cancellation reason is required",
      });
    }

    const order = await Order.findById(req.params.id);

    console.log("REQ.USER:", req.user);
    console.log("ORDER.USER:", order?.user);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (!req.user || !order.user || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.deliveryStatus)) {
      return res.status(400).json({
        message: "Cannot cancel after shipment",
      });
    }

    order.isCancelled = true;
    order.deliveryStatus = "Cancelled";
    order.cancelReason = reason;

    order.history = order.history || [];
    order.history.push({
      status: "Cancelled",
      type: "cancel",
      date: new Date(),
    });

    await order.save();

    res.json(order);
    console.log("ORDER FULL:", order);
  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({ message: "Cancel failed", error: error.message });
  }
};

export const returnOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // ✅ 🔥 ADD THIS LINE (MAIN FIX)
    if (!isReturnAllowed(order)) {
      return res.status(400).json({
        message: "Return window expired (7 days)",
      });
    }

    order.deliveryStatus = "Return Requested";
    order.isReturned = true;
    order.returnReason = reason;

    order.history.push({
      status: "Return Requested",
      type: "return",
      date: new Date(),
    });

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.deliveryStatus = "Return Approved";

    order.history = order.history || [];
    order.history.push({
      status: "Return Approved",
      type: "return",
      date: new Date(),
    });

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const rejectReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryStatus = "Return Rejected";
    order.isReturned = false;

    order.history = order.history || [];
    order.history.push({
      status: "Return Rejected",
      type: "return",
      date: new Date(),
    });

    await order.save();

    res.json(order);

  } catch (error) {
    console.error("REJECT RETURN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // Update delivery status if final step
    if (status === "Returned") {
      order.deliveryStatus = "Returned";
    }

    if (status === "Refund Done") {
      order.deliveryStatus = "Refund Completed";
    }

    // Push into unified history
    order.history = order.history || [];
    order.history.push({
      status,
      type: "return",
      date: new Date(),
    });
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const isReturnAllowed = (order) => {
  if (order.deliveryStatus !== "Delivered") return false;

  const deliveredStep = order.history?.find(
    (h) => h.status === "Delivered"
  );

  if (!deliveredStep) return false;

  const deliveredDate = new Date(deliveredStep.date);
  const now = new Date();

  const diffDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};