import mongoose from "mongoose";

const buySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
    sessionId: {
      type: String,
      required: true,
      select: false,
    },
    stripeId: {
      type: String,
      required: true,
      select: false,
    },
    price: {
      type: Number,
      required: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredDate: {
      type: Date,
      default: null,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Buy = mongoose.model("Buy", buySchema);

export default Buy;
