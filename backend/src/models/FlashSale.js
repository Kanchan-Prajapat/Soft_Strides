import mongoose from "mongoose";

const flashSaleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Flash Sale"
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    discountPercentage: {
  type: Number,
  default: 30
}

  },
  { timestamps: true }
);

export default mongoose.model("FlashSale", flashSaleSchema);
