import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";


export const createProduct = async (req, res) => {
  try {
    const { name, originalPrice, discountPrice, stock, sizes, category, color, description, fit, fabric, length, closure } = req.body;

    if (!name || !originalPrice || !discountPrice || !stock || !category || !color) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const imageUrls = [];

    console.log("--- CREATE PRODUCT DEBUG ---");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    for (const file of req.files) {
      console.log("Processing file:", file);
      const uploadedImage = await cloudinary.uploader.upload(
        file.path,
        {
          folder: "softstrides/products",
        }
      );
      console.log("Cloudinary response:", uploadedImage);
      imageUrls.push(uploadedImage.secure_url);
    }

    const product = await Product.create({
      name,
      originalPrice,
      discountPrice,
      stock,
      category,
      color: color?.trim(),
      sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      description: req.body.description
        ? JSON.parse(req.body.description)
        : [],
      images: imageUrls,
      featuredPriority: 9999,
    fit: fit?.trim(),
fabric: fabric?.trim(),
length: length?.trim(),
closure: closure?.trim(),
    });

    res.status(201).json(product);
    console.log("PRODUCT CREATED:", product);

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    console.error("Error Stack:", err.stack);
    res.status(500).json({ message: err.message, stack: err.stack });
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
      filter.discountPrice = {
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
  const product = await Product.findOne({
  _id: req.params.id,
  isVisible: true,
}).populate("category");

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
    const { name, originalPrice, discountPrice, stock, category, color, description, sizes, fit, fabric, length, closure, } = req.body;

    const updates = {
      name,
      originalPrice,
      discountPrice,
      stock,
      sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
      category,
      color: color?.trim(),
      description: req.body.description
        ? JSON.parse(req.body.description)
        : [],
      fit,
      fabric,
      length,
      closure,

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


export const toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isVisible = !product.isVisible;

    await product.save();

    res.json({
      message: `Product ${
        product.isVisible ? "Published" : "Hidden"
      } successfully`,
      product,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateFeaturedPriority = async (req, res) => {
  try {
    const { featuredPriority } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.featuredPriority = Number(featuredPriority);

    await product.save();

    res.json({
      message: "Priority updated successfully",
      product,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  
  try {

    const filter = {
      isVisible: true,
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter)
      .populate("category").sort({ featuredPriority: 1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const reorderFeaturedProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    const updates = products.map((item, index) =>
      Product.findByIdAndUpdate(
        item._id,
        {
          featuredPriority: index + 1,
        }
      )
    );

    await Promise.all(updates);

    res.json({
      message: "Featured products reordered successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};