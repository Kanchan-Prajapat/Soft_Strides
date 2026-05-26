import express from "express";

import {
  createCoupon,
  getCoupons,
  toggleCoupon,
  deleteCoupon,
  applyCoupon,
  getAvailableCoupons,
} from "../controllers/couponController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get( "/available", protect, getAvailableCoupons );
router.post( "/apply", protect, applyCoupon );
router.post(  "/", protect, adminOnly, createCoupon);
router.get(  "/",protect,  adminOnly,  getCoupons );
router.delete( "/:id", protect, adminOnly, deleteCoupon );
router.put(  "/:id/toggle",  protect,  adminOnly,  toggleCoupon );

export default router;