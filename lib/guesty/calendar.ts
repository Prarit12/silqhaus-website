import {
  getGuestyOpenApiAccessToken,
  getGuestyOpenApiBaseUrl,
  invalidateGuestyOpenApiToken,
} from "./open-api-auth";

export interface NormalizedCalendarDay {
  date: string;
  price: number;
  minNights: number;
  isBlocked: boolean;
  cta: boolean;
  ctd: boolean;
}

export interface NormalizedGuestyCalendar {
  listingId: string;
  currency: string;
  days: NormalizedCalendarDay[];
}

interface RawDay {
  date?: string;
  price?: number;
  currency?: string;
  minNights?: number;
  blocks?: Record<string, unknown>;
  cta?: boolean;
  ctd?: boolean;
  listingId?: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { ts: number; data: NormalizedGuestyCalendar }>();

function cacheKey(listingId: string, startDate: string, endDate: string) {
  return `${listingId}|${startDate}|${endDate}`;
}

function readCache(
  listingId: string,
  startDate: string,
  endDate: string,
): NormalizedGuestyCalendar | null {
  const k = cacheKey(listingId, startDate, endDate);
  const entry = cache.get(k);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(k);
    return null;
  }
  return entry.data;
}

function writeCache(
  listingId: string,
  startDate: string,
  endDate: string,
  data: NormalizedGuestyCalendar,
) {
  cache.set(cacheKey(listingId, startDate, endDate), {
    ts: Date.now(),
    data,
  });
}

function normalizeDay(raw: RawDay): NormalizedCalendarDay {
  const blocks = raw.blocks || {};
  const isBlocked = Object.values(blocks).some((v) => !!v);
  return {
    date: String(raw.date || ""),
    price: Number(raw.price || 0),
    minNights: Number(raw.minNights || 1),
    isBlocked,
    cta: !!raw.cta,
    ctd: !!raw.ctd,
  };
}

async function openApiFetch(path: string, retry = true): Promise<Response> {
  const token = await getGuestyOpenApiAccessToken();
  const res = await fetch(`${getGuestyOpenApiBaseUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (res.status === 401 && retry) {
    invalidateGuestyOpenApiToken();
    return openApiFetch(path, false);
  }
  return res;
}

export class GuestyOpenApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "GuestyOpenApiError";
  }
}

function extractDaysContainer(json: unknown): unknown {
  if (!json || typeof json !== "object") return [];
  const j = json as Record<string, unknown>;
  const data = (j.data as Record<string, unknown>) || j;
  return (data as Record<string, unknown>).days ?? data.calendar ?? data;
}

function extractListingDays(container: unknown): {
  rawDays: RawDay[];
  currency?: string;
  listingId?: string;
} {
  if (Array.isArray(container)) {
    return { rawDays: container as RawDay[] };
  }
  if (container && typeof container === "object") {
    const obj = container as Record<string, unknown>;
    if (Array.isArray(obj.calendar)) {
      return {
        rawDays: obj.calendar as RawDay[],
        currency:
          typeof obj.currency === "string"
            ? (obj.currency as string)
            : undefined,
        listingId:
          typeof obj.listingId === "string"
            ? (obj.listingId as string)
            : undefined,
      };
    }
    if (Array.isArray(obj.days)) {
      return {
        rawDays: obj.days as RawDay[],
        currency:
          typeof obj.currency === "string"
            ? (obj.currency as string)
            : undefined,
        listingId:
          typeof obj.listingId === "string"
            ? (obj.listingId as string)
            : undefined,
      };
    }
  }
  return { rawDays: [] };
}

export async function getGuestyListingCalendar(
  listingId: string,
  startDate: string,
  endDate: string,
): Promise<NormalizedGuestyCalendar> {
  const cached = readCache(listingId, startDate, endDate);
  if (cached) return cached;

  const qs = new URLSearchParams({
    view: "compact",
    startDate,
    endDate,
  });
  const res = await openApiFetch(
    `/availability-pricing/api/calendar/listings/minified/${encodeURIComponent(listingId)}?${qs.toString()}`,
  );
  if (!res.ok) {
    const text = await res.text();
    throw new GuestyOpenApiError(
      `Guesty calendar error: ${res.status} ${text}`,
      res.status,
    );
  }
  const json = await res.json();
  const container = extractDaysContainer(json);
  const { rawDays, currency: containerCurrency } =
    extractListingDays(container);
  const days = rawDays.map(normalizeDay).filter((d) => d.date);
  const currency = String(
    containerCurrency ||
      (rawDays.find((d) => d.currency)?.currency as string) ||
      "THB",
  );
  const normalized: NormalizedGuestyCalendar = {
    listingId,
    currency,
    days,
  };
  writeCache(listingId, startDate, endDate, normalized);
  return normalized;
}

export async function getGuestyBulkCalendar(
  listingIds: string[],
  startDate: string,
  endDate: string,
): Promise<NormalizedGuestyCalendar[]> {
  if (listingIds.length === 0) return [];

  const uncached: string[] = [];
  const result: NormalizedGuestyCalendar[] = [];
  for (const id of listingIds) {
    const cached = readCache(id, startDate, endDate);
    if (cached) result.push(cached);
    else uncached.push(id);
  }
  if (uncached.length === 0) return result;

  const qs = new URLSearchParams({
    listingIds: uncached.join(","),
    startDate,
    endDate,
  });
  const res = await openApiFetch(
    `/availability-pricing/api/calendar/listings?${qs.toString()}`,
  );
  if (!res.ok) {
    const text = await res.text();
    throw new GuestyOpenApiError(
      `Guesty bulk calendar error: ${res.status} ${text}`,
      res.status,
    );
  }
  const json = await res.json();
  const container = extractDaysContainer(json);

  const byListing = new Map<string, { rawDays: RawDay[]; currency?: string }>();

  if (Array.isArray(container)) {
    // Could be: flat array of day records (each with listingId) OR
    // an array of listing groups [{ listingId, calendar/days, currency }, ...]
    for (const entry of container) {
      if (!entry || typeof entry !== "object") continue;
      const e = entry as Record<string, unknown>;
      if (Array.isArray(e.calendar) || Array.isArray(e.days)) {
        const sub = extractListingDays(e);
        const id = sub.listingId || "";
        if (!id) continue;
        const existing = byListing.get(id) || { rawDays: [] };
        existing.rawDays.push(...sub.rawDays);
        existing.currency = existing.currency || sub.currency;
        byListing.set(id, existing);
      } else {
        const id = String((e as RawDay).listingId || "");
        if (!id) continue;
        const existing = byListing.get(id) || { rawDays: [] };
        existing.rawDays.push(e as RawDay);
        byListing.set(id, existing);
      }
    }
  } else if (container && typeof container === "object") {
    // Could be: { [listingId]: { calendar/days, currency } } OR
    // { listingId, calendar/days } single-listing-style.
    const obj = container as Record<string, unknown>;
    const looksLikeSingleListing =
      typeof obj.listingId === "string" &&
      (Array.isArray(obj.calendar) || Array.isArray(obj.days));
    if (looksLikeSingleListing) {
      const sub = extractListingDays(obj);
      if (sub.listingId)
        byListing.set(sub.listingId, {
          rawDays: sub.rawDays,
          currency: sub.currency,
        });
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (!value || typeof value !== "object") continue;
        const sub = extractListingDays(value);
        const id = sub.listingId || key;
        const existing = byListing.get(id) || { rawDays: [] };
        existing.rawDays.push(...sub.rawDays);
        existing.currency = existing.currency || sub.currency;
        byListing.set(id, existing);
      }
    }
  }

  for (const id of uncached) {
    const entry = byListing.get(id) || { rawDays: [] };
    const days = entry.rawDays.map(normalizeDay).filter((d) => d.date);
    const currency = String(
      entry.currency ||
        (entry.rawDays.find((d) => d.currency)?.currency as string) ||
        "THB",
    );
    const normalized: NormalizedGuestyCalendar = {
      listingId: id,
      currency,
      days,
    };
    writeCache(id, startDate, endDate, normalized);
    result.push(normalized);
  }
  return result;
}

export interface RangePricing {
  totalPrice: number;
  nights: number;
  unavailableDates: string[];
  minimumStay: number;
  averageNightlyRate: number;
  currency: string;
  fromPrice: number;
  pricedNights: number;
  pricedTotalPrice: number;
  pricedAverageNightlyRate: number;
}

export function computeRangePricing(
  cal: NormalizedGuestyCalendar,
  checkOutDate?: string,
  checkInDate?: string,
): RangePricing {
  let totalPrice = 0;
  let nights = 0;
  let pricedTotalPrice = 0;
  let pricedNights = 0;
  const unavailableDates: string[] = [];
  let minimumStay = 1;
  let minAvailablePrice = Infinity;

  for (const day of cal.days) {
    if (checkOutDate && day.date === checkOutDate) {
      if (day.ctd) unavailableDates.push(day.date);
      continue;
    }
    if (checkInDate && day.date === checkInDate && day.cta) {
      unavailableDates.push(day.date);
      continue;
    }
    if (day.minNights > minimumStay) minimumStay = day.minNights;
    if (day.price > 0) {
      pricedTotalPrice += day.price;
      pricedNights++;
    }
    if (day.isBlocked) {
      unavailableDates.push(day.date);
      continue;
    }
    if (day.price > 0) {
      totalPrice += day.price;
      nights++;
      if (day.price < minAvailablePrice) minAvailablePrice = day.price;
    }
  }

  return {
    totalPrice,
    nights,
    unavailableDates,
    minimumStay,
    averageNightlyRate: nights > 0 ? Math.round(totalPrice / nights) : 0,
    currency: cal.currency,
    fromPrice:
      minAvailablePrice === Infinity ? 0 : Math.round(minAvailablePrice),
    pricedNights,
    pricedTotalPrice,
    pricedAverageNightlyRate:
      pricedNights > 0 ? Math.round(pricedTotalPrice / pricedNights) : 0,
  };
}
