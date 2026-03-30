import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQty,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.delete("/:id", protect, removeFromCart);
router.put("/:id", protect, updateCartQty);

export default router;