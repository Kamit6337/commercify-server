import express from "express";
import loginCheck from "../controllers/auth/custom/loginCheck.js";
import sendOTP from "../controllers/auth/login/sendOTP.js";
import verifyOTP from "../controllers/auth/login/verifyOTP.js";
import signupSendOTP from "../controllers/auth/signup/signupSendOTP.js";
import logout from "../controllers/auth/custom/logout.js";

const router = express.Router();

// NOTE: SEND OTP AND VERIFY OTP
router.post("/login/send-otp", sendOTP).post("/login/verify-otp", verifyOTP);

// NOTE: SIGNUP THROUGH MOBILE AND VERIFY OTP
router
  .post("/signup/send-otp", signupSendOTP)
  .post("/signup/verify-otp", verifyOTP);

// NOTE: CONTINUOUS CHECK LOGIN
router.get("/login/check", loginCheck);

// NOTE: LOGOUT AND UPDATE USER
router.get("/logout", logout);

export default router;
