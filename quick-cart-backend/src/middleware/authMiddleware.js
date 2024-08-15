import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

export const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Super Admins only." });
    }
    next();
  };


export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user associated with the token
      req.user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
