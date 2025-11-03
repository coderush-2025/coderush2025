import mongoose from "mongoose";

// Cache the MongoDB connection across hot reloads in development
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error("⚠️ Please add your MongoDB URI to .env.local");
  }

  // If there's no cached promise, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering
      maxPoolSize: 100, // Handle up to 100 concurrent connections
      minPoolSize: 10, // Maintain at least 10 connections ready
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxIdleTimeMS: 30000, // Close idle connections after 30 seconds
      retryWrites: true, // Automatically retry failed writes
      retryReads: true, // Automatically retry failed reads
      w: 'majority' as const, // Wait for majority of nodes to confirm writes
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }

  return cached.conn;
}