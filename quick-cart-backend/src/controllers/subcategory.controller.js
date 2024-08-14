import { v2 as cloudinary } from 'cloudinary';
import prisma from '../../lib/prisma.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Get All Subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Create a new subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Ensure categoryId is defined and not empty
    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const newSubcategory = await prisma.subcategory.create({
      data: {
        title,
        imageUrl,
        category: {
          connect: { id: categoryId },
        },
      },
    });

    res.status(201).json(newSubcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  //Delete a subcategory
  export const deleteSubcategory = async (req, res) => {
    const subcategoryId = req.params.id;
  
    try {
      // Get the subcategory by ID
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId },
      });
  
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
  
      // Delete the subcategory from the database
      await prisma.subcategory.delete({
        where: { id: subcategoryId },
      });
  
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message, 
      });
    }
  };