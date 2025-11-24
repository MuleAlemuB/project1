// ESM-compatible named export
export const authorizeRoles = (...allowed) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Not authenticated" });
      if (!allowed.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};
