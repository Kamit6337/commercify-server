import express from "express";
import productRatings from "../controllers/ratingController/productRatings.js";
import giveRating from "../controllers/ratingController/giveRating.js";
import updateRating from "../controllers/ratingController/updateRating.js";
import deleteRating from "../controllers/ratingController/deleteRating.js";

const router = express.Router();

// prettier-ignore
router
.route("/")
.get(productRatings)
.post(giveRating)
.patch(updateRating)
.delete(deleteRating)

export default router;
