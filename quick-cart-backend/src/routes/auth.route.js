import express from "express";
import { createSeller, login, loginAdmin, logoutUser, registerUser, createAdmin } from "../controllers/auth.controller.js";
import { isSuperAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

//Auth routes
router.post("/register", registerUser);
router.post("/login", login);
router.post("/login/admin", loginAdmin);
router.post("/logout", logoutUser);
router.post("/seller", createSeller);
router.post("/admin/create", isSuperAdmin, createAdmin);

export default router;
