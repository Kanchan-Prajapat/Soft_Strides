import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: Number,
        size: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    appliedCouponCode: {
      type: String,
      default: null,
    },

    address: String,
    phone: String,

    paymentScreenshot: String,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    trackingId: String,

    deliveryStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Return Approved",
        "Return Rejected",
        "Refund Completed",
        "Returned",
      ],
      default: "Pending",
    },

    estimatedDelivery: Date,

    isCancelled: {
  type: Boolean,
  default: false,
},

cancelReason: String,

isReturned: {
  type: Boolean,
  default: false,
},

returnReason: String,

returnStatus: {
  type: String,
   enum: [
    "None",
    "Requested",
    "Approved",
    "Pickup Scheduled",
    "Picked Up",
    "Refunded",
    "Completed",
    "Rejected"
  ],
  default: "None",
},

history: [
  {
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String, // delivery | return | cancel
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
],


  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
