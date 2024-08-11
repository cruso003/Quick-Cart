import express from "express";
import { createProduct, deleteProduct, getProducts, searchProducts, updateProduct } from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to search for products
router.get('/search', searchProducts);

// Create a new product
router.post("/", upload.array('file', 10), createProduct);

// Update product by ID
router.put("/:id", upload.array('file', 10), updateProduct);

// Delete product by ID
router.delete("/:id", deleteProduct);

export default router;
