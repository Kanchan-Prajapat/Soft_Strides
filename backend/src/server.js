  // src/server.js
  import express from "express";
  import dotenv from "dotenv";
  import path from "path";
  import cors from "cors";
  import { connectDB } from "./config/db.js";
  import authRoutes from "./routes/authRoutes.js";
  import productRoutes from "./routes/productRoutes.js";
  import orderRoutes from "./routes/orderRoutes.js";
  import userRoutes from "./routes/userRoutes.js";
  import adminRoutes from "./routes/adminRoutes.js";
  import categoryRoutes from "./routes/categoryRoutes.js";
  import dashboardRoutes from "./routes/dashboardRoutes.js";
  import paymentRoutes from "./routes/paymentRoutes.js";
  import reviewRoutes from "./routes/reviewRoutes.js";
  import bannerRoutes from "./routes/bannerRoutes.js";
  import couponRoutes from "./routes/couponRoutes.js";
  import wishlistRoutes from "./routes/wishlistRoutes.js";
import flashSaleRoutes from "./routes/flashSaleRoutes.js";

  dotenv.config();
  connectDB();

  const app = express();
  app.use(express.json());


  app.use(cors());
  app.use("/uploads", express.static("uploads"));
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/banners", bannerRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/uploads", express.static("uploads"));
  app.use("/api/flash-sales", flashSaleRoutes);


  app.get("/", (req, res) => {
    res.send("Soft Strides API Running...");
  });


  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
