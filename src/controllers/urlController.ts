import { type Request, type Response } from "express";
import mongoose from "mongoose";
import Url from "../models/Url";
import { generateCode } from "../utils/generateCode";
import {
  canUseInMemoryFallback,
  createInMemoryUrl,
  getAllInMemoryUrls,
  incrementInMemoryUrlClicks,
} from "../services/inMemoryUrlStore";

const isDbConnected = () => mongoose.connection.readyState === 1;

const sendDbUnavailable = (res: Response) => {
  res.status(503).json({
    error:
      "Database unavailable. Check MongoDB Atlas network access and backend MONGO_URI.",
  });
};

const resolveBaseUrl = (req: Request) => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0].trim()
      : req.protocol;

  const forwardedHost = req.headers["x-forwarded-host"];
  const host =
    (typeof forwardedHost === "string"
      ? forwardedHost.split(",")[0].trim()
      : undefined) ?? req.get("host");

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  return `http://localhost:${process.env.PORT ?? 5000}`;
};

export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const useInMemoryFallback = !isDbConnected() && canUseInMemoryFallback();

  if (!isDbConnected() && !useInMemoryFallback) {
    sendDbUnavailable(res);
    return;
  }

  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      res.status(400).json({ error: "Long URL is required" });
      return;
    }

    const shortCode = generateCode();

    const baseUrl = resolveBaseUrl(req);

    if (useInMemoryFallback) {
      const inMemoryUrl = createInMemoryUrl(shortCode, longUrl);
      res.json({
        shortUrl: `${baseUrl}/${shortCode}`,
        ...inMemoryUrl,
      });
      return;
    }

    const newUrl = await Url.create({ shortCode, longUrl });

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
  req: Request,
  res: Response
): Promise<void> => {
  const useInMemoryFallback = !isDbConnected() && canUseInMemoryFallback();

  if (!isDbConnected() && !useInMemoryFallback) {
    sendDbUnavailable(res);
    return;
  }

  try {
    if (useInMemoryFallback) {
      const baseUrl = resolveBaseUrl(req);
      const urls = getAllInMemoryUrls().map((url) => ({
        ...url,
        shortUrl: `${baseUrl}/${url.shortCode}`,
      }));
      res.json(urls);
      return;
    }

    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  const useInMemoryFallback = !isDbConnected() && canUseInMemoryFallback();

  try {
    const { code } = req.params;
    if (useInMemoryFallback) {
      const inMemoryUrl = incrementInMemoryUrlClicks(code);
      if (inMemoryUrl) {
        res.redirect(inMemoryUrl.longUrl);
      } else {
        res.status(404).json({ message: "URL not found" });
      }
      return;
    }

    if (!isDbConnected()) {
      res
        .status(503)
        .json({ message: "Database unavailable. Please try again shortly." });
      return;
    }

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
