// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log("JWT ERROR:", error);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    console.log("NO AUTH HEADER");
    res.status(401).json({ message: "No token" });
  }
};