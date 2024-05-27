import express from "express";
import makePaymentSession from "../controllers/payment/makePaymentSession.js";
import afterSuccessfulPayment from "../controllers/payment/afterSuccessfulPayment.js";
import afterFailedPayment from "../controllers/payment/afterFailedPayment.js";
import paymentMiddleware from "../middlewares/paymentMiddleware.js";

const router = express.Router();

router.route("/").post(makePaymentSession);

router.get("/success", afterSuccessfulPayment);

export default router;
