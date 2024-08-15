import prisma from "../../lib/prisma.js";


// Create Wallet
export const createWallet = async (req, res) => {
  try {
    const { userId } = req.body;
    const wallet = await prisma.wallet.create({
      data: {
        userId,
      },
    });
    res.status(201).json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Wallet Balance
export const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Wallet Balance
export const updateWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
      include: {
        transactions: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const updatedWallet = await prisma.wallet.update({
      where: {
        userId,
      },
      data: {
        balance: wallet.balance + amount,
        transactions: {
          create: {
            type: amount >= 0 ? "TOPUP" : "PURCHASE",
            amount: Math.abs(amount),
          },
        },
      },
    });

    res.json(updatedWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Transaction History
export const getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId,
      },
      include: {
        transactions: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json({ transactions: wallet.transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
