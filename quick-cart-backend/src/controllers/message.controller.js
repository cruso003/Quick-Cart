import prisma from "../../lib/prisma.js";


export const sendMessage = async (req, res) => {
  const { content, receiverId } = req.body;
  const senderId = req.user.id;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    // Emit the message to the receiver via WebSocket
    req.io.to(receiverId).emit('newMessage', message);

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { userId } = req.user;
  const { withUserId } = req.query;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: userId },
        ],
      },
      orderBy: { sentAt: 'asc' },
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
