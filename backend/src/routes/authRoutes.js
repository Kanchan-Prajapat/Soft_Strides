// src/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe , 
  forgotPassword, 
  resetPassword,  
  verifyOtp, verifyRegisterOtp} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { googleLogin, googleAdminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);
router.post("/admin/google", googleAdminLogin);
router.post("/verify-otp", verifyOtp);
router.post("/verify-register-otp", verifyRegisterOtp);

export default router;
