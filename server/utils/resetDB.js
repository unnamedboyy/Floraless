import mongoose from "mongoose";

export const resetDB = async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

  console.log("✅ Semua data berhasil dihapus");
};