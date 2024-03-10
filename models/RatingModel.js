import { Schema, model } from "mongoose";

const ratingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    title: {
      type: String,
      default: null,
    },
    comment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = model("Rating", ratingSchema);

export default Rating;
