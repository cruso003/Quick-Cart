export const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'super_admin') {
      return res.status(403).json({ message: "Access denied. Super Admins only." });
    }
    next();
  };