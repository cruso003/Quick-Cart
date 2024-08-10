import prisma from '../../lib/prisma.js';


// Get all stores
export const getStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany();
    res.status(200).json({ success: true, data: stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch store by name
export const getStoresByName = async (req, res) => {
  try {
    const businessName = req.params.businessName;

    const store = await prisma.store.findUnique({
      where: { businessName },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch store by ID
export const getStoresById = async (req, res) => {
  try {
    const storeId = req.params.id;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to display a store page
export const getStoresInfo = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    // Fetch the store with related products
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { products: true }, // Fetch related products
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Render or send the store and products to the client as needed
    res.render("store", { store, products: store.products });
  } catch (error) {
    console.error("Error fetching store and products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to update store information
export const updateStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const updatedFields = req.body;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updatedFields,
    });

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(updatedStore);
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to delete a store
export const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const deletedStore = await prisma.store.delete({
      where: { id: storeId },
    });

    if (!deletedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
