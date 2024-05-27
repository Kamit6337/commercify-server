import express from "express";
import makePaymentSession from "../controllers/payment/makePaymentSession.js";
import afterSuccessfulPayment from "../controllers/payment/afterSuccessfulPayment.js";

const router = express.Router();

router.route("/").post(makePaymentSession);

router.get("/success", afterSuccessfulPayment);

export default router;
