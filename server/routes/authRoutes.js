import express from "express";
import { signin, getMe, logout } from "../controllers/authController.js";
const router = express.Router();

router.post("/signin", signin);
router.get("/getMe", getMe);
router.post("/logout", logout);

export default router;
