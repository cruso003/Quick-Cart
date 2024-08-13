import { v2 as cloudinary } from 'cloudinary'
import prisma from '../../lib/prisma.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

export const uploadBanner = async (req, res) => {
  try {
    const { name, linkedProducts } = req.body;
    const file = req.file;

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
      folder: "banner_images",
    });

    // Create a new banner
    const banner = await prisma.banner.create({
      data: {
        name,
        imageUrl: cloudinaryUpload.secure_url,
        linkedProducts: {
          create: linkedProducts.map((productId) => ({
            product: {
              connect: { id: productId },
            },
          })),
        },
      },
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBanners = async (req, res) => {
  try {
    // Retrieve all banners with linked products
    const banners = await prisma.banner.findMany({
      include: {
        linkedProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBannerById = async (req, res) => {
  const bannerId = req.params.id;
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
      include: {
        linkedProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { name, linkedProducts } = req.body;
    const file = req.file;

    let updatedBannerData = { name };

    if (file) {
      const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
        folder: "banner_images",
      });
      updatedBannerData.imageUrl = cloudinaryUpload.secure_url;
    }

    if (linkedProducts) {
      updatedBannerData.linkedProducts = {
        deleteMany: {},
        create: linkedProducts.map((productId) => ({
          product: {
            connect: { id: productId },
          },
        })),
      };
    }

    // Update banner details
    const updatedBanner = await prisma.banner.update({
      where: { id: bannerId },
      data: updatedBannerData,
    });

    res.json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBanner = async (req, res) => {
  const bannerId = req.params.id;

  try {
    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    // Delete the image from Cloudinary
    if (banner.imageUrl) {
      const publicId = banner.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id: bannerId },
    });

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
