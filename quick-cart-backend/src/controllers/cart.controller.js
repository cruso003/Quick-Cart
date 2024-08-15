import prisma from "../../lib/prisma.js";


export const getCartItems = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { cart: { userId: req.params.userId } },
      include: { product: true, cart: true },
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCartItem = async (req, res) => {
  try {
    const newCartItem = await prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: req.body.cartId,
          },
        },
        product: {
          connect: {
            id: req.body.productId,
          },
        },
        salePrice: req.body.salePrice,
        qty: req.body.qty || 1,
        checked: req.body.checked !== undefined ? req.body.checked : true,
        selectedVariations: req.body.selectedVariations,
        shipmentOption: req.body.shipmentOption,
        deliveryFee: req.body.deliveryFee,
        selectedCity: req.body.selectedCity,
        selectedState: req.body.selectedState,
        selectedPickupStation: req.body.selectedPickupStation,
        selectedAddress: req.body.selectedAddress,
      },
    });
    res.status(201).json(newCartItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCartItems = async (req, res) => {
  try {
    const itemIds = req.body.itemIds;

    await prisma.cartItem.deleteMany({
      where: { id: { in: itemIds } },
    });

    res.json({ message: 'Cart items deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

