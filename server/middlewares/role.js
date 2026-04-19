const role = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Akses ditolak"
      });
    }

    next();
  };
};

export default role;