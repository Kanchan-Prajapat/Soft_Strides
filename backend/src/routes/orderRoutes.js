// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updatePaymentStatus,
  updateDeliveryStatus,
  cancelOrder,
  returnOrder,
  approveReturn,
  rejectReturn,
  updateReturnStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/* ================= USER ================= */

router.post("/", protect, upload.single("paymentScreenshot"), createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.product",
        select: "name images price",
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 REMOVE BROKEN PRODUCTS
    order.products = order.products.filter(
      (item) => item.product !== null
    );

    res.json(order);

  } catch (error) {
    console.error("ORDER ERROR:", error);  // 👈 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/cancel/:id", protect, cancelOrder);
router.put("/return/:id", protect, returnOrder);

/* ================= ADMIN ================= */

router.get("/", protect, adminOnly, getAllOrders);

router.put("/payment/:id", protect, adminOnly, updatePaymentStatus);
router.put("/delivery/:id", protect, adminOnly, updateDeliveryStatus);
router.put("/return/approve/:id", protect, adminOnly, approveReturn);
router.put("/return/reject/:id", protect, adminOnly, rejectReturn);
router.put("/return/status/:id", protect, adminOnly, updateReturnStatus);
router.put("/return/update/:id", protect, adminOnly, updateReturnStatus);



export default router;
