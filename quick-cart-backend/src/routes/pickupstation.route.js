import express from "express";
import { createPickupStation, deletePickupStation, getPickupStationById, getPickupStations, updatePickupStation } from "../controllers/pickupstation.controller.js";
const router = express.Router();

// Route to create a new pickup station
router.post("/", createPickupStation);

// Route to update an existing pickup station by ID
router.put("/:id", updatePickupStation);

// Route to delete a pickup station by ID
router.delete("/:id", deletePickupStation);

// Route to fetch all pickup stations,
router.get("/", getPickupStations);

// Route to fetch a single pickup station by ID
router.get("/:id", getPickupStationById);

export default router;
