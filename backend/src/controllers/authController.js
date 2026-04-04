// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const clientAdmin = new OAuth2Client(process.env.ADMIN_GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, picture } = ticket.getPayload();

  let user = await User.findOne({ email });

 if (!user) {
  user = await User.create({
    name,
    email,
    password: "google_login",
    profileImage: picture,
    isVerified: true,       
    authProvider: "google", 
  });
}

  const jwtToken = generateToken(user._id);

  res.json({ token: jwtToken, user });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const googleAdminLogin = async (req, res) => {
  const { token } = req.body;

  const ticket = await clientAdmin.verifyIdToken({
    idToken: token,
    audience: process.env.ADMIN_GOOGLE_CLIENT_ID,
  });

  const { email, name, picture } = ticket.getPayload();

  const user = await User.findOne({ email });

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  const jwtToken = generateToken(user._id);

  res.json({ token: jwtToken, user });
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  // ✅ अगर already verified user है
  if (userExists && userExists.isVerified) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // ✅ अगर user है but verify नहीं हुआ → नया OTP भेजो
  let user;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (userExists) {
    userExists.verificationOtp = otp;
    userExists.verificationOtpExpire = Date.now() + 10 * 60 * 1000;

    await userExists.save();

    return res.json({
      message: "OTP resent",
      otp,
    });
  }

  // ✅ NEW USER CREATE
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
    verificationOtp: otp,
    verificationOtpExpire: Date.now() + 10 * 60 * 1000,
  });

  res.json({
    message: "OTP sent",
    otp,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

if (!user)
  return res.status(400).json({ message: "Invalid credentials" });

// 🔥 ADD THIS BLOCK HERE
if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email first",
  });
}

if (user.authProvider === "google") {
  return res.status(400).json({
    message: "Use Google login",
  });
}

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

 res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
    profileImage: user.profileImage
  }
});
};


export const getMe = async (req, res) => {
  res.json(req.user);
};




export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.json({
    message: "OTP generated",
    otp, 
  });
};


export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({ email });

  // ✅ EMAIL CHECK
  if (!user) {
    return res.status(404).json({
      message: "Email not registered",
    });
  }

  // ✅ GOOGLE USER BLOCK
  if (user.authProvider === "google") {
    return res.status(400).json({
      message: "Use Google login",
    });
  }

  // ✅ EMAIL VERIFIED CHECK
  if (!user.isVerified) {
    return res.status(400).json({
      message: "Email not verified",
    });
  }

  // ✅ OTP EXPIRE CHECK
  if (user.resetOtpExpire < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  // ✅ OTP MATCH CHECK
  if (user.resetOtp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  // ✅ RESET PASSWORD
  user.password = await bcrypt.hash(password, 10);
  user.resetOtp = undefined;
  user.resetOtpExpire = undefined;

  await user.save();

  const token = generateToken(user._id);

  res.json({
    message: "Password reset successful",
    token,
    user,
  });
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    verificationOtp: otp,
    verificationOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.verificationOtp = undefined;
  user.verificationOtpExpire = undefined;

  await user.save();

  const token = generateToken(user._id);

  res.json({ token, user });
};



export const verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    verificationOtp: otp,
    verificationOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.verificationOtp = undefined;
  user.verificationOtpExpire = undefined;

  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
};