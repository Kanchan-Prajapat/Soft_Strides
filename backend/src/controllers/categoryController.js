//categoryController.js
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

import streamifier from "streamifier";

const uploadFromBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "softstrides/categories" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "softstrides/categories" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadRes = await uploadFromBuffer(req.file);

    const category = await Category.create({
      name,
      image: uploadRes.secure_url,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getCategories = async (req, res) => {
  const categories = await Category.find();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat._id });
      return { ...cat._doc, productCount: count };
    })
  );

  res.json(categoriesWithCount);
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const updates = { name };

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "softstrides/categories",
      });
      updates.image = uploadRes.secure_url;
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const products = await Product.find({ category: req.params.id });

  if (products.length > 0) {
    return res.status(400).json({
      message: "Cannot delete category with existing products",
    });
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};
