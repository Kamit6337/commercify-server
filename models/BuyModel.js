import mongoose from "mongoose";

const buySchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    buyDate: {
      type: Date,
      default: Date.now(),
    },
    quantity: {
      type: Number,
      default: 1,
    },
    delievered: {
      type: Boolean,
      default: false,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    address: {
      localAdd: String,
      district: String,
      state: String,
      nation: {
        type: String,
        default: "India",
      },
      PIN: {
        type: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Buy = mongoose.model("Buy", buySchema);

export default Buy;
