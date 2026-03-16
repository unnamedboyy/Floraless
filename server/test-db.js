require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log("URI:", uri);

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB Atlas CONNECTED");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });