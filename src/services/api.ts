import type { UrlData } from "../types";

const ENV_API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)
  ?.trim()
  .replace(/\/+$/, "");

const API_REQUEST_TIMEOUT_MS = 12000;

const buildBaseUrlCandidates = (): string[] => {
  const candidates: string[] = [];
  const add = (value?: string) => {
    if (value && !candidates.includes(value)) {
      candidates.push(value);
    }
  };

  add(ENV_API_BASE_URL);

  // Development fallback if the configured host is unavailable.
  if (import.meta.env.DEV) {
    add("http://localhost:5000");
    add("http://127.0.0.1:5000");
  }

  if (candidates.length === 0) {
    add("");
  }

  return candidates;
};

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    API_REQUEST_TIMEOUT_MS
  );

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const parseErrorMessage = async (res: Response): Promise<string> => {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await res.json().catch(() => null);
    if (data && typeof data.error === "string") {
      return data.error;
    }
    if (data && typeof data.message === "string") {
      return data.message;
    }
  }

  const fallbackText = await res.text().catch(() => "");
  return fallbackText || `Request failed with status ${res.status}`;
};

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const baseUrlCandidates = buildBaseUrlCandidates();
  let lastNetworkError: unknown = null;

  for (const baseUrl of baseUrlCandidates) {
    try {
      const response = await fetchWithTimeout(`${baseUrl}${path}`, init);
      if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
      }
      return (await response.json()) as T;
    } catch (error) {
      const isAbortError =
        error instanceof DOMException && error.name === "AbortError";
      const isNetworkError = error instanceof TypeError || isAbortError;

      if (isNetworkError) {
        lastNetworkError = error;
        continue;
      }

      throw error;
    }
  }

  if (lastNetworkError) {
    throw new Error(
      "Unable to reach the API. Check VITE_API_URL or run backend on http://localhost:5000."
    );
  }

  throw new Error("API request failed");
};

export const shortenUrl = async (longUrl: string) =>
  requestJson<UrlData>("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });

export const getAllUrls = async () => requestJson<UrlData[]>("/api/admin/urls");

export const getRedirectBaseUrl = () => {
  const [baseUrl] = buildBaseUrlCandidates();
  return baseUrl || window.location.origin;
};
