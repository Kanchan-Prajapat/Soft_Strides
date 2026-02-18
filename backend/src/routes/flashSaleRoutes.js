import express from "express";
import {
  createFlashSale,
  getActiveFlashSale,
  getAllFlashSalesAdmin,
  deleteFlashSale
} from "../controllers/flashSaleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// user side
router.get("/", getActiveFlashSale);

// admin side
router.get("/admin", protect, adminOnly, getAllFlashSalesAdmin);
router.post("/", protect, adminOnly, createFlashSale);
router.delete("/:id", protect, adminOnly, deleteFlashSale);

export default router;
