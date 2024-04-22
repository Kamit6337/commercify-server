import express from "express";
import productRatings from "../controllers/ratingController/productRatings.js";
import giveRating from "../controllers/ratingController/giveRating.js";

const router = express.Router();

// prettier-ignore
router
.route("/")
.get(productRatings)
.post(giveRating)

export default router;
