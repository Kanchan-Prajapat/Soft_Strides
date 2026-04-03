// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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



export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");

user.verificationToken = verificationToken;
user.isVerified = false;

await user.save();

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // ✅ TOKEN RETURN
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
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

  const user = await User.findOne({
    email,
    resetOtp: otp,
    resetOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetOtp = undefined;
  user.resetOtpExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};