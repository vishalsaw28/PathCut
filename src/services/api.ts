const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// 👆 frontend env variable fallback

export const shortenUrl = async (longUrl: string) => {
  const res = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to shorten URL");
  }

  return await res.json();
};
