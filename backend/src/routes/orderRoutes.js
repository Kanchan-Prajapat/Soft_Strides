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

const router = express.Router();

/* ================= USER ================= */

router.post("/", protect, upload.single("paymentScreenshot"), createOrder);
router.get("/my-orders", protect, getMyOrders);
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
