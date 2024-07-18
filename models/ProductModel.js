import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title to product"],
    },
    description: {
      type: String,
      required: [true, "Please provide description to product"],
    },
    price: {
      type: Number,
      required: [true, "Price should be provided to product"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    deliveredBy: {
      type: Number,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    thumbnail: {
      type: String,
      required: [true, "You must provide thumbnail for your product"],
    },
    rate: {
      type: Number,
      default: 0,
    },
    rateCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

export default Product;
