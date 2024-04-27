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

  // Retrieve all products
  const allProducts = await Product.find().lean();

  // Generate random days for each product
  const bulkUpdateOperations = allProducts.map((product) => {
    const randomDay = Math.trunc(Math.random() * 7) + 1;
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { deliveredBy: randomDay } },
      },
    };
  });

  // Perform bulk update
  const bulkUpdate = await Product.bulkWrite(bulkUpdateOperations);

  console.log("bulkUpdate", bulkUpdate);

  mongoose.connection.close();
});
