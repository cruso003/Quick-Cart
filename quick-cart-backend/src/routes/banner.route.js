import express from "express";
import upload from "../middleware/upload.js";
import { deleteBanner, getBannerById, getBanners, updateBanner, uploadBanner } from "../controllers/banner.controller.js";
const router = express.Router();

// Route to upload banner
router.post('/', upload.single('file'), uploadBanner);

// Route to get banner
router.get('/', getBanners);

// Get banner by ID
router.get("/:id", getBannerById);

// Update banner by ID
router.put("/:id", upload.single('file'), updateBanner);

// Delete banner by ID
router.delete("/:id", deleteBanner);

export default router;
