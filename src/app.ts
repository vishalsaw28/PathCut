import express, { type Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes";
import { redirectUrl } from "./controllers/urlController"; // ⬅️ Import redirect

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api", urlRoutes);

// ✅ Redirect Route (short links)
app.get("/:code", redirectUrl); // ⬅️ Add this line

// ✅ Connect to MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
