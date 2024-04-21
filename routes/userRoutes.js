import express from "express";
import updateUserProfile from "../controllers/userController/updateUserProfile.js";
import verifyOtpAndUpdate from "../controllers/userController/verifyOtpAndUpdate.js";

const router = express.Router();

router.route("/").post(updateUserProfile).patch(verifyOtpAndUpdate);

export default router;
