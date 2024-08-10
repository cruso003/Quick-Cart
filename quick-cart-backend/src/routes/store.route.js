import express from "express";
import { deleteStore, getStores, getStoresById, getStoresByName, getStoresInfo, updateStore } from "../controllers/store.controller.js";
const router = express.Router();

// Get all stores
router.get("/", getStores);
// get store info by id
router.get("/storeInfo/:storeId", getStoresInfo);

// Fetch store by name
router.get("/storeName/:businessName", getStoresByName);

// Fetch store by id
router.get("/:storeId", getStoresById);
// Route to update store information
router.put("/:storeId", updateStore);

// Route to delete a store
router.delete("/:storeId", deleteStore);

export default router;
