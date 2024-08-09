import express from "express";
import {
  addDeliveryAddress,
  forgotPassword,
  getAllUsers,
  getUserById,
  removeAddressById,
  resendSecurityCode,
  updateAddressById,
  updateUserByEmail,
  verifyOtpAndResetPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

// User routes
router.get("/get-users", getAllUsers);
router.get("/:userId", getUserById);
router.put("/:email", updateUserByEmail);
router.post("/:email/delivery-address", addDeliveryAddress);
router.put("/address/:addressId", updateAddressById);
router.delete("/delete-address/:addressId", removeAddressById);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-reset-password", verifyOtpAndResetPassword);
router.post("/resend-security-code", resendSecurityCode);

export default router;
