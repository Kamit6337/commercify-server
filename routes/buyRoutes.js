import express from "express";
import getUserBuys from "../controllers/buyController/getUserBuys.js";
import cancelOrder from "../controllers/buyController/cancelOrder.js";

const router = express.Router();

router.get("/", getUserBuys);

router.patch("/cancel", cancelOrder);

export default router;
