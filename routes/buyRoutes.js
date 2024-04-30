import express from "express";
import getUserBuys from "../controllers/buyController/getUserBuys.js";
import cancelOrder from "../controllers/buyController/cancelOrder.js";
import returnOrder from "../controllers/buyController/returnOrder.js";

const router = express.Router();

router.get("/", getUserBuys);

router.patch("/cancel", cancelOrder);
router.patch("/return", returnOrder);

export default router;
