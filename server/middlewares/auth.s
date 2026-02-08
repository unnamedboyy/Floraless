const { verifyToken } = require("../utils/jwt");

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyToken(token);
    req.user = payload; // 🔥 penting
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;