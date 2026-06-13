import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }
};
