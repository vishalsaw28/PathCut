export interface UrlData {
  id: number;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
  created: string;
}

export type ViewType = "home" | "admin";
