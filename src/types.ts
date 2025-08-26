import type { Key } from "react";

export interface UrlData {
  _id: Key | null | undefined;
  id: number;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
  created: string;
}

export type ViewType = "home" | "admin";
