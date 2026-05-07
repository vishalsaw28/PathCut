import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import urlRoutes from "../routes/urlRoutes";
import redirectRoutes from "../routes/redirectRoutes";
import connectDB from "../config/db";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://path-cut.vercel.app",
]);

const isLocalDevOrigin = (origin: string) =>
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", urlRoutes);

app.get("/", (_req, res) => {
  res.send("URL Shortener Backend is running! Use /api for API endpoints.");
});

app.use("/", redirectRoutes);

app.get("/api/ping", (_req, res) => {
  res.json({
    message: "pong",
    mongo: mongoose.connection.readyState,
    baseUrl: BASE_URL,
  });
});

app.listen(PORT, () => console.log(` Server running at ${BASE_URL}`));

connectDB().catch((err) => {
  console.error(
    " MongoDB connection error. API is running but DB-backed routes will return 503 until MongoDB is reachable.",
    err
  );
});
