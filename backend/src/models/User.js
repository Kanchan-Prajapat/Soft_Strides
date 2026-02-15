// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
    },
  contact: {
    type: String,
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
  type: Boolean,
  default: false,
},
wishlist: [
  {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  } 
],

  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
