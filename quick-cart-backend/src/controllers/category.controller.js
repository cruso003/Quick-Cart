import { v2 as cloudinary } from 'cloudinary'
import prisma from '../../lib/prisma.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Get All Categories
export const getCategories = async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          subcategories: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

//Create new category
export const createCategory = async (req, res) => {
    try {
      const { title, subTitle } = req.body;
      const file = req.file; 
  
      // Upload image to Cloudinary
      const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
        folder: "category_images",
      });
  
      // Create a new category with Cloudinary image URL
      const newCategory = await prisma.category.create({
        data: {
          title,
          subTitle,
          imageUrl: cloudinaryUpload.secure_url,
        },
      });
  
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Delete Category by its ID
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    // Get the category by ID
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find all products associated with this category
    const products = await prisma.product.findMany({
      where: { categoryId: categoryId },
    });

    // Get all product IDs
    const productIds = products.map(product => product.id);

    // Delete all variations associated with these products
    await prisma.variation.deleteMany({
      where: { productId: { in: productIds } },
    });

    // Delete all products associated with this category
    await prisma.product.deleteMany({
      where: { categoryId: categoryId },
    });

    // Delete the category from the database
    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
