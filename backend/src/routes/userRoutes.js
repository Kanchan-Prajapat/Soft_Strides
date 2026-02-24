// src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    updateUserProfile,changeUserPassword,
    updateUserLocation,
    uploadProfileImage
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import User from "../models/User.js";
import Order from "../models/Order.js";


import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();


router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changeUserPassword);
router.put("/location", protect, updateUserLocation);
router.put("/profile-image", protect, upload.single("profileImage"), uploadProfileImage);
// ADMIN - GET ALL CUSTOMERS
router.get("/customers", protect, async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await User.find({
      role: "user",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

router.patch("/customers/:id/block", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});


router.delete("/customers/:id", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});


router.get("/customers/:id/orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
