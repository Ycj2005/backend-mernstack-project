import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";

export async function DBConnection() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error?.message || error);
    process.exit(1);
  }
}
