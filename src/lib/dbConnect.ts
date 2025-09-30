import mongoose from "mongoose";

let isConnected: boolean = false;

export default async function dbConnect(): Promise<void> {
  if (isConnected) return;

  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error("⚠️ Please add your MongoDB URI to .env.local");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }
}