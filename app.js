import express from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import HandleGlobalError from "./utils/HandleGlobalError.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import buyRouter from "./routes/buyRoutes.js";
import ratingRouter from "./routes/ratingRoutes.js";
import userRouter from "./routes/userRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";
import protectUserRoutes from "./middlewares/protectUserRoutes.js";
import globalMiddlewares from "./middlewares/globalMiddlwares.js";
import "./utils/passport.js";

const app = express();

// MARK: GLOBAL MIDDLEWARES
globalMiddlewares(app);

// NOTE: DIFFERENT ROUTES
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/ratings", protectUserRoutes, ratingRouter);
app.use("/user", protectUserRoutes, userRouter);
app.use("/address", protectUserRoutes, addressRouter);
app.use("/buy", protectUserRoutes, buyRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);
// app.use("/doubleAuth", doubleAuthRouter);

// NOTE: UNIDENTIFIED ROUTES
app.all("*", (req, res, next) => {
  return next(
    new HandleGlobalError(
      `Somethings went wrong. Please check your Url - ${req.originalUrl}`,
      500,
      "Fail"
    )
  );
});

//  NOTE: GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
