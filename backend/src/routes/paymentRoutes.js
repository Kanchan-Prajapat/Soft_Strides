// import express from "express";
// // import { getAllPayments } from "../controllers/paymentController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/adminMiddleware.js";
// import {
//   createRazorpayOrder,
//   verifyRazorpayPayment,
// } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/create-order", createRazorpayOrder);
// router.post("/verify", verifyRazorpayPayment);


// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET ALL PAYMENTS (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const payments = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});

export default router;