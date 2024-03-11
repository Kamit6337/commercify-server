import express from "express";
import getUserAddress from "../controllers/addressController/getUserAddress.js";
import createNewAddress from "../controllers/addressController/createNewAddress.js";

const router = express.Router();

router.route("/").get(getUserAddress).post(createNewAddress);

export default router;
