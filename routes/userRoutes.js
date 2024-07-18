import express from "express";
import updateUserProfile from "../controllers/userController/updateUserProfile.js";
import verifyOtpAndUpdate from "../controllers/userController/verifyOtpAndUpdate.js";

const router = express.Router();

router.route("/").post(updateUserProfile);

router.post("/update/verify-otp", verifyOtpAndUpdate);

export default router;
