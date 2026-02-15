import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;

    if (!name || !price || !stock || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const imageUrls = [];

    for (const file of req.files) {

      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "softstrides/products" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });

      const uploadedImage = await uploadStream();
      imageUrls.push(uploadedImage.secure_url);
    }

    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description,
      images: imageUrls,
    });

    res.status(201).json(product);

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// GET ALL PRODUCTS (PUBLIC)
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      size,
      color,
      search,
    } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice && maxPrice) {
      filter.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice),
      };
    }

    if (size) {
      filter.sizes = size; // your product must have sizes array
    }

    if (color) {
      filter.color = color;
    }

    const products = await Product.find(filter).populate("category");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PRODUCT (ADMIN)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;

    const updates = {
      name,
      price,
      stock,
      category,
      description,
    };

    // If new images uploaded → upload to Cloudinary
    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: "softstrides/products",
        });

        imageUrls.push(uploadRes.secure_url);
      }

      updates.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Product update failed" });
  }
};


// DELETE PRODUCT (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const createCategory = async (req, res) => {
//   const category = await Category.create({ name: req.body.name });
//   res.json(category);
// };
