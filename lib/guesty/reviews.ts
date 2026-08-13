import {
  getGuestyOpenApiAccessToken,
  getGuestyOpenApiBaseUrl,
  invalidateGuestyOpenApiToken,
} from "./open-api-auth";
import { getJson, setJson } from "./cache";

/**
 * Guest reviews from the Guesty Open API (/reviews), indexed per listing.
 *
 * Guesty syncs channel reviews (Airbnb today) but exposes no per-listing
 * aggregate, so we sweep the account's reviews once, resolve reviewer first
 * names from /guests-crud, and keep only public-safe fields — the raw payload
 * carries private_feedback and guest ids that must never reach the client.
 * The index is cached hard: reviews change on the order of days, not minutes.
 */

export interface GuestyRawReview {
  _id: string;
  channelId?: string;
  listingId?: string;
  guestId?: string;
  createdAt?: string;
  rawReview?: {
    reviewer_role?: string;
    reviewee_role?: string;
    hidden?: boolean;
    submitted?: boolean;
    overall_rating?: number;
    public_review?: string;
    submitted_at?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Public-safe review shape, aligned with the Hostaway review fields the
 *  ReviewCard component already renders. */
export interface NormalizedGuestyReview {
  listingId: string;
  /** Site OTA channel convention from config/ota-channels (2018 = Airbnb). */
  channelId: number;
  publicReview: string;
  reviewerName: string | null;
  insertedOn: string;
  /** 5-star scale. */
  rating: number;
}

export interface GuestyReviewSummary {
  /** Average on a 5-star scale, one decimal (e.g. 4.9). */
  avg: number;
  count: number;
}

const PAGE_LIMIT = 100;
/** Safety cap: 20 pages = 2 000 reviews, far above the account's volume. */
const MAX_PAGES = 20;
const NAME_LOOKUP_CONCURRENCY = 5;

const INDEX_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const INDEX_CACHE_TTL_SECONDS = INDEX_CACHE_TTL_MS / 1000;
const INDEX_KV_KEY = "guesty:reviews-index:v1";

type ReviewsIndex = Record<string, NormalizedGuestyReview[]>;

interface IndexCacheEntry {
  data: ReviewsIndex;
  expires_at: number;
}

let indexCache: IndexCacheEntry | null = null;
let inFlightIndex: Promise<ReviewsIndex> | null = null;

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
function isCountableGuestReview(review: GuestyRawReview): boolean {
  const raw = review.rawReview;
  if (!raw) return false;
  // Guesty also syncs host→guest reviews; only guest-written ones count.
  if (raw.reviewer_role && raw.reviewer_role !== "guest") return false;
  if (raw.hidden === true) return false;
  if (raw.submitted === false) return false;
  return true;
}

/** Per-review rating on a 5 scale (Booking-style 10-scales are halved). */
function reviewRatingOutOfFive(review: GuestyRawReview): number | null {
  const rating = Number(review.rawReview?.overall_rating);
  if (!Number.isFinite(rating) || rating <= 0) return null;
  return rating > 5 ? rating / 2 : rating;
}

/** "airbnb2" → 2018 etc., per config/ota-channels ids. */
function siteChannelId(guestyChannelId: string | undefined): number {
  const family = (guestyChannelId || "").toLowerCase();
  if (family.startsWith("airbnb")) return 2018;
  if (family.startsWith("booking")) return 2005;
  if (family.startsWith("vrbo") || family.startsWith("homeaway")) return 2009;
  if (family.startsWith("expedia")) return 2007;
  return 2015; // "Custom" — renders a neutral star icon and no OTA link
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

/** guestId → first name, best-effort with bounded concurrency. */
async function resolveGuestFirstNames(
  guestIds: string[],
): Promise<Map<string, string>> {
  const names = new Map<string, string>();
  const queue = [...new Set(guestIds)];
  const workers = Array.from(
    { length: Math.min(NAME_LOOKUP_CONCURRENCY, queue.length) },
    async () => {
      while (queue.length > 0) {
        const id = queue.shift();
        if (!id) return;
        try {
          const res = await openApiFetch(
            `/guests-crud/${encodeURIComponent(id)}?fields=firstName`,
          );
          if (!res.ok) {
            await res.text().catch(() => "");
            continue;
          }
          const json = await res.json();
          const guest = json?.data ?? json;
          const first =
            typeof guest?.firstName === "string" ? guest.firstName.trim() : "";
          if (first) names.set(id, first);
        } catch {
          // Name stays unresolved; the card renders without one.
        }
      }
    },
  );
  await Promise.all(workers);
  return names;
}

async function buildIndex(): Promise<ReviewsIndex> {
  const t0 = Date.now();
  const rawReviews = await fetchAllReviews();
  const countable = rawReviews.filter(
    (r) =>
      r.listingId && isCountableGuestReview(r) && reviewRatingOutOfFive(r),
  );

  const names = await resolveGuestFirstNames(
    countable.map((r) => r.guestId).filter((id): id is string => !!id),
  );

  const index: ReviewsIndex = {};
  for (const review of countable) {
    const listingId = review.listingId as string;
    const rating = reviewRatingOutOfFive(review) as number;
    const normalized: NormalizedGuestyReview = {
      listingId,
      channelId: siteChannelId(review.channelId),
      publicReview: (review.rawReview?.public_review || "").trim(),
      reviewerName: (review.guestId && names.get(review.guestId)) || null,
      insertedOn:
        review.rawReview?.submitted_at || review.createdAt || "",
      rating,
    };
    (index[listingId] ??= []).push(normalized);
  }
  for (const reviews of Object.values(index)) {
    reviews.sort((a, b) => (a.insertedOn < b.insertedOn ? 1 : -1));
  }

  console.log(
    `[guesty-reviews] Indexed ${countable.length}/${rawReviews.length} reviews across ${Object.keys(index).length} listings, ${names.size} reviewer names resolved. (took ${Date.now() - t0}ms)`,
  );
  return index;
}

async function getReviewsIndex(): Promise<ReviewsIndex> {
  if (indexCache && indexCache.expires_at > Date.now()) {
    return indexCache.data;
  }
  if (inFlightIndex) return inFlightIndex;

  const promise = (async () => {
    try {
      const kvCached = await getJson<IndexCacheEntry>(INDEX_KV_KEY);
      if (kvCached && kvCached.expires_at > Date.now()) {
        indexCache = kvCached;
        return kvCached.data;
      }

      const index = await buildIndex();
      const entry: IndexCacheEntry = {
        data: index,
        expires_at: Date.now() + INDEX_CACHE_TTL_MS,
      };
      indexCache = entry;
      await setJson(INDEX_KV_KEY, entry, INDEX_CACHE_TTL_SECONDS);
      return index;
    } finally {
      inFlightIndex = null;
    }
  })();

  inFlightIndex = promise;
  return promise;
}

/** All public reviews for one listing, newest first. */
export async function getGuestyListingReviews(listingId: string): Promise<{
  reviews: NormalizedGuestyReview[];
  totalCount: number;
}> {
  const index = await getReviewsIndex();
  const reviews = index[listingId] ?? [];
  return { reviews, totalCount: reviews.length };
}

/**
 * { listingId → { avg, count } } for every Guesty listing with guest reviews.
 * Throws on upstream failure — callers treat review data as optional and
 * catch, so a Guesty hiccup never blocks listings.
 */
export async function getGuestyReviewSummaries(): Promise<
  Record<string, GuestyReviewSummary>
> {
  const index = await getReviewsIndex();
  const out: Record<string, GuestyReviewSummary> = {};
  for (const [listingId, reviews] of Object.entries(index)) {
    if (reviews.length === 0) continue;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    out[listingId] = {
      avg: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
    };
  }
  return out;
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
