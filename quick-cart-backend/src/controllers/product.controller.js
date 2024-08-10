import { v2 as cloudinary } from 'cloudinary';
import prisma from '../../lib/prisma.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create a new product
export const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      discount_price,
      category,
      subcategory,
      brand,
      variations,
      sellerId,
      featured,
      condition,
      stock,
      totalSale,
    } = req.body;

    // Parse variations if it's a string
    if (typeof variations === 'string') {
      try {
        variations = JSON.parse(variations);
      } catch (error) {
        return res.status(400).json({ error: "Invalid variations format" });
      }
    }

    // Convert string numeric fields to numbers
    price = parseFloat(price);
    discount_price = discount_price ? parseFloat(discount_price) : undefined;
    stock = stock ? parseInt(stock, 10) : undefined;
    featured = featured === 'true';
    totalSale = totalSale ? parseInt(totalSale, 10) : 0;

    console.log(req.body);

    // Validate input
    if (!name || !description || isNaN(price) || !sellerId) {
      return res
        .status(400)
        .json({ error: "Please provide name, description, price, and seller" });
    }

    // Check if variations are provided and it's an array
    if (
      variations !== undefined &&
      (!Array.isArray(variations) ||
        variations.some(
          (v) =>
            !v || typeof v !== "object" || !v.name || !Array.isArray(v.options)
        ))
    ) {
      return res.status(400).json({ error: "Invalid variations format" });
    }

    // Find the corresponding store using the selected store name
    const store = await prisma.store.findUnique({
      where: { id: sellerId },
    });

    // Check if the store exists
    if (!store) {
      return res.status(400).json({ error: "Selected seller does not exist" });
    }

    // Upload images to Cloudinary (assuming req.files exists and is an array)
    const uploadedImages = req.files
      ? await Promise.all(
          req.files.map(async (file) => {
            try {
              const result = await cloudinary.uploader.upload(file.path, {
                folder: "products_images",
              });
              return {
                public_id: result.public_id,
                url: result.secure_url,
              };
            } catch (error) {
              console.log("Error uploading image:", error);
              res.status(500).json({ error: "Error uploading image" });
              throw error;
            }
          })
        )
      : [];

    // Create a new Product instance
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discountPrice: discount_price,
        category,
        subcategory,
        variations,
        brand,
        condition,
        featured,
        stock,
        totalSale,
        images: {
          create: uploadedImages.map((img) => ({
            url: img.url,
            public_id: img.public_id,
          })),
        },
        store: {
          connect: { id: store.id },
        },
      },
    });

    // Send the saved product as a response
    res.status(201).json(newProduct);
  } catch (error) {
    console.log("error.message", error.message);
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};



// Get all products
export const getProducts = async (req, res) => {
    try {
      const products = await prisma.product.findMany();
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// Search products
export const searchProducts = async (req, res) => {
    try {
      const { searchText, category, brand } = req.query;
      const query = {};
  
      if (searchText) {
        const searchTextRegex = `%${searchText}%`;
        query.OR = [
          { name: { contains: searchTextRegex, mode: 'insensitive' } },
          { description: { contains: searchTextRegex, mode: 'insensitive' } },
        ];
      }
  
      // Filter by category, brand, condition, etc.
      if (category) {
        query.category = category;
      }
  
      if (brand) {
        query.brand = brand;
      }
  
      const products = await prisma.product.findMany({
        where: query,
      });
  
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedFields = req.body;

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updatedFields,
        lastUpdated: new Date(),
      },
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product with id ${productId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Get the product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    // Delete the images from Cloudinary
    if (product.images && Array.isArray(product.images)) {
      await Promise.all(
        product.images.map(async (image) => {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        })
      );
    }

    // Delete the product from Prisma
    await prisma.product.delete({ where: { id: productId } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error deleting product with id ${productId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
