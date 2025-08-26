import { type Request, type Response } from "express";
import Url from "../models/Url";
import { generateCode } from "../utils/generateCode";

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

    const shortCode = generateCode();

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

export const getAllUrls = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (url) {
      res.redirect(url.longUrl);
    } else {
      res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
