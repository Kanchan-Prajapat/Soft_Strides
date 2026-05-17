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
    name: { type: String, required: true },
   originalPrice: {
  type: Number,
  required: true,
},

discountPrice: {
  type: Number,
  required: true,
},
    stock: { type: Number, required: true },
  description: { type: [String], default: [], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [String],

    sizes: {
      type: [String],
      default: [],
    },

    // 🔥 NEW FIELDS
    fit: {
      type: String,
      enum: ["Regular", "Oversized", "Slim", "Relaxed", "Other"],
      default: "Regular",
    },

    fabric: {
      type: String,
      enum: [
        "Cotton",
        "Combed Cotton",
        "Cotton Lycra",
        "Cotton Blends",
        "Jersey",
        "Tri-blend",
        "Polyester",
        "Poplin",
        "Oxford",
        "Linen",
        "Twill",
        "Other",
      ],
      default: "Cotton",
    },

   length: {
  type: String,
  enum: [
    "Regular",
    "Long",
    "Short",
    "Other"
  ],
  default: "Regular",
},

   closure: {
  type: String,
  enum: [
    "Button",
    "Zip",
    "No Closure",
    "Other"
  ],
  default: "No Closure",
},

    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

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


