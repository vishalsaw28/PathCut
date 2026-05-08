import mongoose from "mongoose";

interface MongoConnectionDiagnostics {
  lastAttemptAt: string | null;
  lastConnectedAt: string | null;
  lastError: string | null;
  lastErrorAt: string | null;
}

const mongoDiagnostics: MongoConnectionDiagnostics = {
  lastAttemptAt: null,
  lastConnectedAt: null,
  lastError: null,
  lastErrorAt: null,
};

const formatMongoError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

export const getMongoConnectionDiagnostics = (): MongoConnectionDiagnostics => ({
  ...mongoDiagnostics,
});

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  // Fail fast when MongoDB is unreachable instead of buffering requests.
  mongoose.set("bufferCommands", false);

  console.log(" Connecting to MongoDB...");
  mongoDiagnostics.lastAttemptAt = new Date().toISOString();

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "urlshortener",
      serverSelectionTimeoutMS: 10000,
    });

    mongoDiagnostics.lastConnectedAt = new Date().toISOString();
    mongoDiagnostics.lastError = null;
    mongoDiagnostics.lastErrorAt = null;

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    mongoDiagnostics.lastError = formatMongoError(error);
    mongoDiagnostics.lastErrorAt = new Date().toISOString();
    throw error;
  }
};

export default connectDB;
