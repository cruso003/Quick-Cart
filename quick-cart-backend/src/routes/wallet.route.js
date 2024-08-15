import express from "express";
import { createWallet, getTransactionHistory, getWalletBalance, updateWalletBalance } from "../controllers/wallet.controller.js";

const router = express.Router();

//create user wallet
router.post("/create-wallet", createWallet);
//get user wallet balance
router.get("/balance/:userId", getWalletBalance);
//update user wallet balance
router.post("/update-balance/:userId", updateWalletBalance);
//get user transaction history
router.get("/transactions/:userId", getTransactionHistory);

export default router;
