import mongoose from "mongoose";

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Cache the MongoDB connection across hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect(): Promise<typeof mongoose> {
  // If we have a cached connection, return it
  if (cached && cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error("⚠️ Please add your MongoDB URI to .env.local");
  }

  // If there's no cached promise, create a new connection
  if (!cached || !cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected");
      return mongooseInstance;
    });

    if (!cached) {
      cached = global.mongoose = { conn: null, promise };
    } else {
      cached.promise = promise;
    }
  }

  try {
    if (!cached.conn) {
      cached.conn = await cached.promise;
    }
  } catch (error) {
    if (cached) {
      cached.promise = null;
    }
    console.error("❌ MongoDB connection failed", error);
    throw error;
  }

  return cached.conn;
}