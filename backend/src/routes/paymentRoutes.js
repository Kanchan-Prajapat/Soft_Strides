import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";


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

router.post("/create-order", createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);


export default router;