import express from "express";
import {
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
    markHelpful,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// USER
router.post("/:id", protect, upload.single("photo"), createReview);
router.put(
  "/helpful/:productId/:reviewId",
  protect,
  markHelpful
);


// ADMIN
router.get("/", protect, adminOnly, getAllReviews);
router.put("/:productId/:reviewId", protect, adminOnly, updateReviewStatus);
router.delete("/:productId/:reviewId", protect, adminOnly, deleteReview);

export default router;





