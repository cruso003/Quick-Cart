import { v2 as cloudinary } from 'cloudinary'
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

    // Handle variations
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

    // Validate input
    if (!name || !description || isNaN(price) || !sellerId) {
      return res
        .status(400)
        .json({ error: "Please provide name, description, price, and seller" });
    }

    // Check if variations are valid
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

    // Find the corresponding store
    const store = await prisma.store.findUnique({
      where: { id: sellerId },
    });

    if (!store) {
      return res.status(400).json({ error: "Selected seller does not exist" });
    }

    // Validate that at least one image is provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    // Upload images
    const uploadedImages = await Promise.all(
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
    );

    // Create a new Product
    const productData = {
      name,
      description,
      price,
      discountPrice: discount_price,
      category: {
        connect: { id: category },
      },
      subcategory: {
        connect: { id: subcategory },
      },
      brand,
      condition,
      featured,
      stock,
      totalSale,
      images: uploadedImages.map((img) => img.url),
      store: {
        connect: { id: store.id },
      },
    };

    // Only add variations if provided
    if (variations?.length) {
      productData.variations = {
        create: variations,
      };
    }

    const newProduct = await prisma.product.create({
      data: productData,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch products and include relevant dat
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variations: true,
        category: {
          select: {
            title: true,
          },
        },
        subcategory: {
          select: {
            title: true,
          },
        },
        store: {
          select: {
            name: true,
            businessName: true,
            phoneNumber: true,
            email: true,
            address: true,
            city: true,
            state: true,
          },
        },
        ratings: true,
      },
    });

    // Map the response to include category, subcategory names, and average rating
    const formattedProducts = products.map((product) => {
      const averageRating =
        product.ratings.length > 0
          ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) / product.ratings.length
          : null;

      return {
        ...product,
        categoryName: product.category?.title,
        subcategoryName: product.subcategory?.title,
        averageRating, // Include the average rating
        store: {
          name: product.store?.name,
          businessName: product.store?.businessName,
          phoneNumber: product.store?.phoneNumber,
          email: product.store?.email,
          address: product.store?.address,
          city: product.store?.city,
          state: product.store?.state,
        },
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const productId = req.params.id;
  try {

    console.log(`Deleting product with id ${productId}`);
    

    // Delete the product from Prisma
    await prisma.product.delete({ where: { id: productId } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(`Error deleting product with id ${productId}:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
