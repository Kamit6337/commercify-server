import express from "express";
import getStripeWebhook from "../controllers/stripe/getStripeWebhook.js";

const router = express.Router();

router.post("/webhook", getStripeWebhook);

export default router;
