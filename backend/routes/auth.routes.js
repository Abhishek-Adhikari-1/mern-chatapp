import express from "express";
import { forgot, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/forgot", forgot);

export default router;
