import express from "express";
import { createSubcategory, deleteSubcategory, getSubcategories } from "../controllers/subcategory.controller";


const router = express.Router();

// Get all subcategories
router.get("/", getSubcategories);

// Create a new subcategory
router.post("/", createSubcategory);

// Delete subcategory by ID
router.delete("/:id", deleteSubcategory);

export default router;
