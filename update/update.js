import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import Category from "../models/CategoryModel.js";
import categoryDataDB from "../data/categoryDataDB.js";
import productData from "../data/productData.js";
import Product from "../models/ProductModel.js";
import Address from "../models/AddressModel.js";
import Buy from "../models/BuyModel.js";

mongoose.connect(environment.MONGO_DB_URI);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Handle connection events
mongoose.connection.on("connected", async () => {
  console.log("Connected to MongoDB");

  mongoose.connection.close();
});
