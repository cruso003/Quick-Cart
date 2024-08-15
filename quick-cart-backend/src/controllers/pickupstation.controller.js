import prisma from "../../lib/prisma";


export const createPickupStation = async (req, res) => {
  try {
    const { name, address } = req.body;
    const pickupStation = await prisma.pickupStation.create({
      data: {
        name,
        address: {
          create: address
        },
      },
    });
    res.status(201).json(pickupStation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPickupStations = async (req, res) => {
  try {
    const pickupStations = await prisma.pickupStation.findMany();
    res.status(200).json(pickupStations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPickupStationById = async (req, res) => {
  try {
    const { id } = req.params;
    const pickupStation = await prisma.pickupStation.findUnique({
      where: { id },
    });
    if (!pickupStation) {
      return res.status(404).json({ error: "Pickup Station not found" });
    }
    res.status(200).json(pickupStation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePickupStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    const pickupStation = await prisma.pickupStation.update({
      where: { id },
      data: {
        name,
        address: {
          update: address
        },
      },
    });
    res.status(200).json(pickupStation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePickupStation = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pickupStation.delete({
      where: { id },
    });
    res.status(204).json({ message: "Pickup Station deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
