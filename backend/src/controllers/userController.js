// src/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist");

  res.json(user.wishlist);
};

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  const productId = req.params.productId;

  const exists = user.wishlist.includes(productId);

  if (exists) {
    user.wishlist.pull(productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json(user.wishlist);
};


export const getCustomers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const customers = await User.find({
      role: "user",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("-password");

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const { name, email } = req.body;

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ CHANGE PASSWORD
export const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await User.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BLOCK / UNBLOCK
export const toggleBlockCustomer = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: "Status updated", isBlocked: user.isBlocked });
};

// DELETE
export const deleteCustomer = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Customer deleted" });
};


export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Check if both fields provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    // Find logged in user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location || location.trim() === "") {
      return res.status(400).json({
        message: "Location is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = location;

    await user.save();

   res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location,
  role: user.role,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};