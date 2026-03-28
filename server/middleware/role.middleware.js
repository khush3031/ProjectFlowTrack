export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role || !req.user.role.name) {
        return res.status(403).json({ message: `Access denied. Required: ${allowedRoles.join(', ')}` });
      }

      if (!allowedRoles.includes(req.user.role.name)) {
        return res.status(403).json({ message: `Access denied. Required: ${allowedRoles.join(', ')}` });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
