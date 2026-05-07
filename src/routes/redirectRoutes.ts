import express from "express";
import mongoose from "mongoose";
import Url from "../models/Url";
import {
  canUseInMemoryFallback,
  incrementInMemoryUrlClicks,
} from "../services/inMemoryUrlStore";

const router = express.Router();

router.get("/:shortCode", async (req, res) => {
  const useInMemoryFallback =
    mongoose.connection.readyState !== 1 && canUseInMemoryFallback();

  try {
    if (useInMemoryFallback) {
      const inMemoryUrl = incrementInMemoryUrlClicks(req.params.shortCode);
      if (!inMemoryUrl) {
        return res.status(404).json({ message: "URL not found" });
      }

      return res.redirect(inMemoryUrl.longUrl);
    }

    if (mongoose.connection.readyState !== 1) {
      return res
        .status(503)
        .json({ message: "Database unavailable. Please try again shortly." });
    }

    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
