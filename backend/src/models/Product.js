import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
     photo: {
      type: String,
    },

    helpfulCount: {
      type: Number,
      default: 0,
    },

    helpfulUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending", // Pending | Approved | Rejected
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
   name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [String],


    sizes: {
  type: [String],
  default: ["S", "M", "L", "XL"]
},
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
],

  },
  { timestamps: true }
);



const Product = mongoose.model("Product", productSchema);
export default Product;


