import express from "express";
import updateUserProfile from "../controllers/userController/updateUserProfile.js";

const router = express.Router();

router.route("/").patch(updateUserProfile);

export default router;
