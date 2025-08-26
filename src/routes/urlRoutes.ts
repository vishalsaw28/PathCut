import express from "express";
import { shortenUrl } from "../controllers/urlController";

const router = express.Router();

// Create short URL (API only)
router.post("/shorten", shortenUrl);

export default router;
