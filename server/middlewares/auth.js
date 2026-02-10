const { verifyToken } = require("../utils/jwt");

function auth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const payload = verifyToken(token);

    // inject user ke request
    req.user = {
      id: payload.id,
      role: payload.role,
      username: payload.username,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
