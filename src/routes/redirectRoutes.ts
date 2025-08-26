import express from "express";
import Url from "../models/Url";

const router = express.Router();

// Redirecting shortCode to long URL
router.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // incrementing the no of clicks
    url.clicks += 1;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
