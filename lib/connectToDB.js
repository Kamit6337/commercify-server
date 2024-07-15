import mongoose from "mongoose";
import { environment } from "../utils/environment.js";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(environment.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
};

export default connectToDB;
