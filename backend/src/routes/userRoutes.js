// src/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    updateUserProfile,changeUserPassword,
    updateUserLocation,
    uploadProfileImage
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";



import { getWishlist, toggleWishlist } from "../controllers/wishlistController.js";

const router = express.Router();


router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changeUserPassword);
router.put("/location", protect, updateUserLocation);
router.put("/profile-image", protect, upload.single("profileImage"), uploadProfileImage);

export default router;
