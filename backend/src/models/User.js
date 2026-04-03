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

   addresses: [
  {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    state: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }
],

    location: {
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

profileImage: {
  type: String,
  default: "",
},

wishlist: [
  {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
  } 
],

cart: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    size: String,
    quantity: Number,
  },
],

isVerified: {
  type: Boolean,
  default: false,
},

authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},

resetPasswordToken: String,
resetPasswordExpire: Date,

  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);
