import express from "express";
import { createSeller, login, logoutUser, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

//Auth routes
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/seller", createSeller);

export default router;
