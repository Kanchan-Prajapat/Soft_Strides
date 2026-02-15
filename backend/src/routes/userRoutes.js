// src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  updateAdminProfile,
  changeAdminPassword,
  getCustomers,
  getCustomerOrders,
    toggleBlockCustomer,
    deleteCustomer
} from "../controllers/userController.js";

import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.put("/profile", protect,  adminOnly, updateAdminProfile);
router.put("/change-password", protect, adminOnly, changeAdminPassword);
router.get("/customers", protect, adminOnly, getCustomers);
router.get("/customers/:id/orders", protect, adminOnly, getCustomerOrders );
router.patch("/customers/:id/block",protect,adminOnly,toggleBlockCustomer);
router.delete("/customers/:id",protect,adminOnly,deleteCustomer);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);


export default router;
