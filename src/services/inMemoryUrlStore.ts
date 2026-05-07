export interface InMemoryUrlRecord {
  _id: string;
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
}

const urlsByCode = new Map<string, InMemoryUrlRecord>();

export const canUseInMemoryFallback = () =>
  process.env.USE_IN_MEMORY_STORE === "true" ||
  process.env.NODE_ENV !== "production";

export const createInMemoryUrl = (
  shortCode: string,
  longUrl: string
): InMemoryUrlRecord => {
  const urlRecord: InMemoryUrlRecord = {
    _id: `mem_${shortCode}`,
    shortCode,
    longUrl,
    clicks: 0,
    createdAt: new Date(),
  };

  urlsByCode.set(shortCode, urlRecord);
  return urlRecord;
};

export const getAllInMemoryUrls = (): InMemoryUrlRecord[] =>
  Array.from(urlsByCode.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

export const findInMemoryUrlByCode = (
  shortCode: string
): InMemoryUrlRecord | null => urlsByCode.get(shortCode) ?? null;

export const incrementInMemoryUrlClicks = (
  shortCode: string
): InMemoryUrlRecord | null => {
  const urlRecord = urlsByCode.get(shortCode);
  if (!urlRecord) {
    return null;
  }

  urlRecord.clicks += 1;
  return urlRecord;
};
