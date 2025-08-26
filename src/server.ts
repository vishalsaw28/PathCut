import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import urlRoutes from "./routes/urlRoutes";
import redirectRoutes from "./routes/redirectRoutes";
import connectDB from "./config/db";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

app.use("/api", urlRoutes);

app.use("/", redirectRoutes);

app.get("/api/ping", (_req, res) => {
  res.json({
    message: "pong",
    mongo: mongoose.connection.readyState,
    baseUrl: BASE_URL,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at ${BASE_URL}`));
});
