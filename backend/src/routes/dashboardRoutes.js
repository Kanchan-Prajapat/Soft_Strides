// src/routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats, getMonthlyRevenue } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/monthly-revenue", protect, adminOnly, getMonthlyRevenue);

export default router;
