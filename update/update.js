import mongoose from "mongoose";
import { environment } from "../utils/environment.js";
import Category from "../models/CategoryModel.js";
import categoryDataDB from "../data/categoryDataDB.js";
import productData from "../data/productData.js";
import Product from "../models/productModel.js";

mongoose.connect(environment.MONGO_DB_URI);

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// MARK: PRODUCT UPDATE
Product.insertMany(productData)
  .then((result) => {
    console.log(`${result.length} products inserted successfully`);
    // Close the MongoDB connection after successful insertion
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error inserting products:", error);
    mongoose.connection.close();
  });

// MARK: CATEGORY UPDATE
// Category.insertMany(categoryDataDB)
//   .then((result) => {
//     console.log(`${result.length} categories inserted successfully`);
//     // Close the MongoDB connection after successful insertion
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.error("Error inserting products:", error);
//     mongoose.connection.close();
//   });
