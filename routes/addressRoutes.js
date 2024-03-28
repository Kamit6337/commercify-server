import express from "express";
import getUserAddress from "../controllers/addressController/getUserAddress.js";
import createNewAddress from "../controllers/addressController/createNewAddress.js";
import updateAddress from "../controllers/addressController/updateAddress.js";

const router = express.Router();

router
  .route("/")
  .get(getUserAddress)
  .post(createNewAddress)
  .patch(updateAddress);

export default router;
