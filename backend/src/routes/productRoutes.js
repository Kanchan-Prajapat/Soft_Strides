import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  toggleProductVisibility,
  getFeaturedProducts,
  getAdminProducts,
  updateFeaturedPriority,
  reorderFeaturedProducts,
    searchSuggestions,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminProducts
);

router.get("/", getProducts);

router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/reorder",
  protect,
  adminOnly,
  reorderFeaturedProducts
);

router.get("/search", searchSuggestions);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);
router.put(
  "/:id/visibility",
  protect,
  adminOnly,
  toggleProductVisibility
);
router.put(
  "/:id/priority",
  protect,
  adminOnly,
  updateFeaturedPriority
);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.get("/:id", getSingleProduct);
// RELATED PRODUCTS



router.get("/related/:categoryId", async (req, res) => {
  try {
    console.log("Category ID:", req.params.categoryId);

    // ❗ VALIDATION (IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);

    const products = await Product.find({
      category: categoryId,
    }).limit(6);

    console.log("Found products:", products.length);

    res.json(products);
  } catch (err) {
    console.log("🔥 RELATED ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
