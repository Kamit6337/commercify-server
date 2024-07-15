import { environment } from "./utils/environment.js";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./index.js";

const PORT = environment.PORT || 8080;
export let isDatabaseConnected = false;

if (environment.NODE_ENV === "production") {
  console.log("Deployment is Successful");
}

console.log("Connecting to MongoDB...");
console.log(`MongoDB URI: ${environment.MONGO_DB_URI}`);

mongoose
  .connect(environment.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    isDatabaseConnected = true;
    app.listen(PORT, () => {
      console.log(`Server is connected on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

mongoose.connection.on("disconnected", () => {
  isDatabaseConnected = false;
  console.log("Disconnected from MongoDB");
});

// mongoose.connect(environment.MONGO_DB_URI);

// // Handle connection events
// mongoose.connection.on("connected", () => {
//   console.log("Connected to MongoDB");
//   isDatabaseConnected = true;
//   app.listen(environment.PORT, () => {
//     console.log(`Server is connected on port ${PORT}`);
//   });
// });

// mongoose.connection.on("error", (err) => {
//   console.error("MongoDB connection error:", err);
// });

// mongoose.connection.on("disconnected", () => {
//   isDatabaseConnected = false;
//   console.log("Disconnected from MongoDB");
// });

// Export the app instance for Vercel
export default app;
