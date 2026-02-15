import express from "express";
import {
  createCoupon,
  getCoupons,
  toggleCoupon,
  deleteCoupon,
    applyCoupon,
} from "../controllers/couponController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.delete("/:id", protect, adminOnly, deleteCoupon);
router.put("/:id/toggle", protect, adminOnly, toggleCoupon);
router.post("/apply", protect, applyCoupon);


export default router;
