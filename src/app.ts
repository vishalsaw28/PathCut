import express, { type Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes";
import { redirectUrl } from "./controllers/urlController";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", urlRoutes);

app.get("/:code", redirectUrl);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
