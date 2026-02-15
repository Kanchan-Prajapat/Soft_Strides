import express from "express";
import {
  createBanner,
  getActiveBanners,
  toggleBanner,
  deleteBanner,
} from "../controllers/bannerController.js";


import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getActiveBanners);
router.post("/", protect, adminOnly, upload.single("image"), createBanner);
router.put("/:id/toggle", protect, adminOnly, toggleBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);


export default router;
