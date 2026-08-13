import {
  getGuestyOpenApiAccessToken,
  getGuestyOpenApiBaseUrl,
  invalidateGuestyOpenApiToken,
} from "./open-api-auth";
import { getJson, setJson } from "./cache";

/**
 * Guest reviews from the Guesty Open API (/reviews), aggregated per listing.
 *
 * Guesty syncs channel reviews (Airbnb today) but exposes no per-listing
 * average on the listing object, so we sweep the account's reviews once and
 * bucket them ourselves. The sweep is cheap (a few pages) and cached hard —
 * reviews change on the order of days, not minutes.
 */

export interface GuestyRawReview {
  _id: string;
  channelId?: string;
  listingId?: string;
  createdAt?: string;
  rawReview?: {
    reviewer_role?: string;
    reviewee_role?: string;
    hidden?: boolean;
    submitted?: boolean;
    overall_rating?: number;
    public_review?: string;
    reviewer?: { first_name?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GuestyReviewSummary {
  /** Average on a 5-star scale, one decimal (e.g. 4.9). */
  avg: number;
  count: number;
}

const PAGE_LIMIT = 100;
/** Safety cap: 20 pages = 2 000 reviews, far above the account's volume. */
const MAX_PAGES = 20;

const SUMMARIES_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const SUMMARIES_CACHE_TTL_SECONDS = SUMMARIES_CACHE_TTL_MS / 1000;
const SUMMARIES_KV_KEY = "guesty:review-summaries:v1";

interface SummariesCacheEntry {
  data: Record<string, GuestyReviewSummary>;
  expires_at: number;
}

let summariesCache: SummariesCacheEntry | null = null;
let inFlightSummaries: Promise<Record<string, GuestyReviewSummary>> | null =
  null;

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

/** A review that should count toward a listing's public rating. */
export function isCountableGuestReview(review: GuestyRawReview): boolean {
  const raw = review.rawReview;
  if (!raw) return false;
  // Guesty also syncs host→guest reviews; only guest-written ones count.
  if (raw.reviewer_role && raw.reviewer_role !== "guest") return false;
  if (raw.hidden === true) return false;
  if (raw.submitted === false) return false;
  return true;
}

/** Per-review rating on a 5 scale (Booking-style 10-scales are halved). */
export function reviewRatingOutOfFive(review: GuestyRawReview): number | null {
  const rating = Number(review.rawReview?.overall_rating);
  if (!Number.isFinite(rating) || rating <= 0) return null;
  return rating > 5 ? rating / 2 : rating;
}

async function fetchAllReviews(): Promise<GuestyRawReview[]> {
  const all: GuestyRawReview[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const skip = page * PAGE_LIMIT;
    const res = await openApiFetch(`/reviews?limit=${PAGE_LIMIT}&skip=${skip}`);
    if (!res.ok) {
      await res.text().catch(() => "");
      throw new Error(`Guesty reviews error: HTTP ${res.status}`);
    }
    const json = await res.json();
    const batch: GuestyRawReview[] = Array.isArray(json?.data)
      ? json.data
      : [];
    all.push(...batch);
    if (batch.length < PAGE_LIMIT) break;
  }
  return all;
}

function aggregate(
  reviews: GuestyRawReview[],
): Record<string, GuestyReviewSummary> {
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const review of reviews) {
    const listingId = review.listingId;
    if (!listingId || !isCountableGuestReview(review)) continue;
    const rating = reviewRatingOutOfFive(review);
    if (rating == null) continue;
    const bucket = buckets.get(listingId) ?? { sum: 0, count: 0 };
    bucket.sum += rating;
    bucket.count += 1;
    buckets.set(listingId, bucket);
  }
  const out: Record<string, GuestyReviewSummary> = {};
  for (const [listingId, { sum, count }] of buckets) {
    out[listingId] = { avg: Math.round((sum / count) * 10) / 10, count };
  }
  return out;
}

/**
 * { listingId → { avg, count } } for every Guesty listing with guest reviews.
 * Throws on upstream failure — callers treat review data as optional and
 * catch, so a Guesty hiccup never blocks listings.
 */
export async function getGuestyReviewSummaries(): Promise<
  Record<string, GuestyReviewSummary>
> {
  if (summariesCache && summariesCache.expires_at > Date.now()) {
    return summariesCache.data;
  }
  if (inFlightSummaries) return inFlightSummaries;

  const promise = (async () => {
    try {
      const kvCached = await getJson<SummariesCacheEntry>(SUMMARIES_KV_KEY);
      if (kvCached && kvCached.expires_at > Date.now()) {
        summariesCache = kvCached;
        return kvCached.data;
      }

      const t0 = Date.now();
      const reviews = await fetchAllReviews();
      const summaries = aggregate(reviews);
      console.log(
        `[guesty-reviews] Aggregated ${reviews.length} reviews into ${Object.keys(summaries).length} listing summaries. (took ${Date.now() - t0}ms)`,
      );

      const entry: SummariesCacheEntry = {
        data: summaries,
        expires_at: Date.now() + SUMMARIES_CACHE_TTL_MS,
      };
      summariesCache = entry;
      await setJson(SUMMARIES_KV_KEY, entry, SUMMARIES_CACHE_TTL_SECONDS);
      return summaries;
    } finally {
      inFlightSummaries = null;
    }
  })();

  inFlightSummaries = promise;
  return promise;
}

/**
 * Best-effort variant for enrichment call sites: failures log and return {}
 * so listings render without ratings instead of erroring.
 */
export async function getGuestyReviewSummariesSafe(): Promise<
  Record<string, GuestyReviewSummary>
> {
  try {
    return await getGuestyReviewSummaries();
  } catch (err) {
    console.warn(
      `[guesty-reviews] Review summaries unavailable, listings will render without ratings: ${err instanceof Error ? err.message : err}`,
    );
    return {};
  }
}
