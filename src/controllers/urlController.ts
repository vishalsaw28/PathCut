import { type Request, type Response } from "express";
import Url from "../models/Url";
import { generateCode } from "../utils/generateCode";

// Shortening a long URL
export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      res.status(400).json({ error: "Long URL is required" });
      return;
    }

    // Generating unique shortCode via utility
    const shortCode = generateCode();

    // Saving to DB
    const newUrl = await Url.create({ shortCode, longUrl });

    const baseUrl =
      process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;

    res.json({
      shortUrl: `${baseUrl}/${shortCode}`,
      ...newUrl.toObject(),
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
};

// Redirecting to original URL
export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
