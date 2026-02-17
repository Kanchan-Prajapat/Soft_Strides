import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCategory
);

router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
