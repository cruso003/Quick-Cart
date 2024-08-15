import express from "express";
import { cancelOrder, getOrders, getOrdersForStore, getUserOrders, placeOrder, placeVirtualOrder, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

// Place orders
router.post("/place-order", placeOrder);
//Get orders
router.get("/get-orders", getOrders);
// Update an order status
router.put("/update-order/:orderId", updateOrder);
// Cancel an order
router.delete("/cancel-order/:orderId", cancelOrder);
// Fetch orders for a particular user
router.get("/user-orders", getUserOrders);
//Fetch orders for a particular store
router.get("/store-orders", getOrdersForStore);
// Place a virtual order
router.post("/place-virtual-order", placeVirtualOrder);

export default router;
