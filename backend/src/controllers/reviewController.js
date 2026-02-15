import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    let photoUrl = "";

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "softstrides/reviews" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadedImage = await streamUpload();
      photoUrl = uploadedImage.secure_url;
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      photo: photoUrl,
      helpfulCount: 0,
      status: "Pending",
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN — GET ALL REVIEWS
export const getAllReviews = async (req, res) => {
  const products = await Product.find().populate("reviews.user", "name email");
  res.json(products);
};

// ADMIN — UPDATE REVIEW STATUS
export const updateReviewStatus = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const review = product.reviews.id(req.params.reviewId);

  review.status = req.body.status;

  await product.save();

  res.json({ message: "Review updated" });
};

// ADMIN — DELETE REVIEW
export const deleteReview = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );

  await product.save();

  res.json({ message: "Review deleted" });
};

// MARK REVIEW HELPFUL
export const markHelpful = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // ✅ Check if already clicked
    const alreadyClicked = review.helpfulUsers.includes(req.user._id);

    if (alreadyClicked) {
      return res.status(400).json({
        message: "You already marked this review helpful",
      });
    }

    review.helpfulUsers.push(req.user._id);
    review.helpfulCount += 1;

    await product.save();

    res.json({ message: "Marked as helpful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
