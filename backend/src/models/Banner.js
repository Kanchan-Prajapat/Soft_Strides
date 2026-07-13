import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,

    desktopImage: String,
    mobileImage: String,

    link: String,

    isActive: {
      type: Boolean,
      default: true,
    },
    desktopPosition: {
  type: String,
  enum: ["left", "center", "right"],
  default: "center",
},

    description: String,
  },
  
  { timestamps: true },
  
);

export default mongoose.model("Banner", bannerSchema);