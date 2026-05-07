import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  // Fail fast when MongoDB is unreachable instead of buffering requests.
  mongoose.set("bufferCommands", false);

  console.log(" Connecting to MongoDB...");

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "urlshortener",
    serverSelectionTimeoutMS: 10000,
  });

  console.log(` MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
