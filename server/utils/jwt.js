// const jwt = require("jsonwebtoken");

// const JWT_SECRET = "supersecretkey"; // nanti pindahkan ke .env

// function signToken(payload) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
// }

// function verifyToken(token) {
//   return jwt.verify(token, JWT_SECRET);
// }

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { signToken, verifyToken };
