import prisma from "../../lib/prisma.js";


export const placeOrder = async (req, res) => {
  const { products, userId, paymentId, deliveryCharge, totalAmount, deliveryMethod, paymentMethod, type } = req.body;
  console.log(req.body);

  try {
    await prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          products: {
            create: await Promise.all(
              products.map(async (product) => {
                const productData = await prisma.product.findUnique({
                  where: { id: product.productId },
                  select: { storeId: true },
                });

                if (!productData) {
                  throw new Error(`Product with id ${product.productId} not found.`);
                }

                return {
                  product: { connect: { id: product.productId } },
                  quantity: product.quantity,
                  store: { connect: { id: productData.storeId } },
                  selectedVariations: product.selectedVariations,
                  deliveryCharge: product.deliveryCharge,
                };
              })
            ),
          },
          userId: userId,
          paymentId: paymentId,
          deliveryCharge: deliveryCharge,
          totalAmount: totalAmount,
          deliveryMethod: deliveryMethod,
          paymentMethod: paymentMethod,
          type: type,
        },
      });

      for (const product of products) {
        await prisma.product.update({
          where: { id: product.productId },
          data: {
            totalSale: {
              increment: product.quantity,
            },
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
    });

    res.status(201).json({ message: "Order placed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order: " + error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Retrieve all orders from the database
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    });

    // Format the orders to include the category name, totalAmount, deliveryMethod, and paymentMethod
    const formattedOrders = orders.map(order => ({
      ...order,
      totalAmount: order.totalAmount,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      products: order.products.map(orderProduct => ({
        ...orderProduct,
        categoryName: orderProduct.product.category?.title || null,
      })),
    }));

    // Send the formatted orders as the response
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Fetch the order based on orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order is cancellable
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ error: "Order cannot be canceled at this stage" });
    }

    // Update the order status to "Canceled"
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Canceled" },
    });

    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch orders for the logged-in user
    const userOrders = await prisma.order.findMany({
      where: { userId: userId },
    });

    res.json(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrdersForStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const orders = await prisma.order.findMany({
      where: {
        products: {
          some: {
            storeId: storeId,
          },
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const placeVirtualOrder = async (req, res) => {
  try {
    // Extract order details from request body
    const { products, userId } = req.body;

    // Create a new virtual order
    const newVirtualOrder = await prisma.order.create({
      data: {
        products: {
          create: products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            storeId: product.storeId,
          })),
        },
        userId: userId,
        type: "Virtual",
      },
    });

    res.status(201).json(newVirtualOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
