import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    link: String, // redirect URL
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
