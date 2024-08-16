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
  console.log('Request Body:', req.body);

  try {
    // Retrieve or create a cart for the user
    console.log('Looking for user cart with userId:', req.body.user);
    let userCart = await prisma.cart.findFirst({
      where: {
        userId: req.body.user,
      },
    });

    if (!userCart) {
      console.log('No cart found, creating a new cart for userId:', req.body.user);
      userCart = await prisma.cart.create({
        data: {
          userId: req.body.user,
        },
      });
      console.log('New cart created:', userCart);
    } else {
      console.log('Existing cart found:', userCart);
    }

    // Add the item to the user's cart
    console.log('Adding item to cart:', {
      cartId: userCart.id,
      productId: req.body.product,
      discountPrice: req.body.salePrice,
      quantity: req.body.qty || 1,
      checked: req.body.checked !== undefined ? req.body.checked : true,
      selectedVariations: req.body.selectedVariations,
      shipmentOption: req.body.shipmentOption,
      deliveryFee: req.body.deliveryFee,
      selectedCity: req.body.selectedCity,
      selectedState: req.body.selectedState,
      selectedPickupStation: req.body.selectedPickupStation,
      selectedAddress: req.body.selectedAddress,
    });

    const newCartItem = await prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: userCart.id,
          },
        },
        product: {
          connect: {
            id: req.body.product,
          },
        },
        discountPrice: req.body.salePrice,
        quantity: req.body.qty || 1,
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

    console.log('New cart item created:', newCartItem);
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error('Error creating cart item:', err);
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

