import express from "express";
import { shortenUrl, getAllUrls } from "../controllers/urlController";

const router = express.Router();

router.post("/shorten", shortenUrl);

router.get("/admin/urls", getAllUrls);

export default router;
