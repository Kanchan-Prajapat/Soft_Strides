//coupenController.js
import Coupon from "../models/Coupon.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    if (!code || !totalAmount) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (totalAmount < coupon.minAmount) {
      return res.status(400).json({
        message: `Minimum order amount is ₹${coupon.minAmount}`,
      });
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({
        message: "You already used this coupon",
      });
    }

    const discountAmount =
      (totalAmount * coupon.discount) / 100;

    const finalAmount = totalAmount - discountAmount;

    res.json({
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.log("APPLY COUPON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// CREATE COUPON
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate, minAmount } = req.body;

    if (!code || !discount || !expiryDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      expiryDate,
      minAmount,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.log("COUPON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    console.log("DELETE COUPON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ message: "Coupon toggled", isActive: coupon.isActive });
  } catch (error) {
    console.log("TOGGLE COUPON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.log("GET COUPONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};