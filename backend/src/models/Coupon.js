import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    

    minAmount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    maxUsesPerUser: {
  type: Number,
  default: 1,
},

usedBy: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    count: {
      type: Number,
      default: 0,
    },
  },
],
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
