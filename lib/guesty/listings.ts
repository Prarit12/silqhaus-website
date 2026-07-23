import {
  getGuestyOpenApiAccessToken,
  getGuestyOpenApiBaseUrl,
  invalidateGuestyOpenApiToken,
  GuestyOpenApiAuthError,
  GuestyOpenApiRateLimitError,
} from "./open-api-auth";
import { getJson, setJson } from "./cache";

// Re-export under the legacy names used across the proxies so route
// handlers can keep their existing imports.
export {
  GuestyOpenApiAuthError as GuestyApiError,
  GuestyOpenApiRateLimitError as GuestyRateLimitError,
};

interface GuestyAddress {
  city?: string;
  country?: string;
  full?: string;
  lat?: number;
  lng?: number;
  state?: string;
  street?: string;
}

interface GuestyPicture {
  original?: string;
  thumbnail?: string;
  regular?: string;
  caption?: string | null;
}

interface GuestyPrices {
  cleaningFee?: number | string | null;
  currency?: string | null;
  basePrice?: number | string | null;
  [key: string]: unknown;
}

export interface GuestyRawListing {
  _id: string;
  title?: string;
  nickname?: string;
  propertyType?: string;
  roomType?: string;
  amenities?: string[];
  bathrooms?: number;
  accommodates?: number;
  bedrooms?: number;
  active?: boolean;
  listed?: boolean;
  address?: GuestyAddress;
  picture?: GuestyPicture | string;
  pictures?: GuestyPicture[];
  prices?: GuestyPrices;
  terms?: { minNights?: number | string | null; [key: string]: unknown };
  integrations?: Array<{
    platform?: string;
    externalUrl?: string;
    [key: string]: unknown;
  }>;
  publicDescription?: {
    summary?: string;
    space?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface NormalizedGuestyListing {
  id: string;
  source: "guesty";
  name: string;
  /** Guesty's internal short name — usually the real property name, where
   *  `title` is the OTA-facing marketing headline. */
  nickname?: string;
  description?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  roomType?: string;
  lat?: number;
  lng?: number;
  address?: string;
  cleaningFee: number | null;
  feeCurrency: string | null;
  /** Named to match Hostaway so cards read one shape across both sources. */
  price: number | null;
  minNights: number | null;
  currencyCode: string | null;
  airbnbListingUrl?: string;
  bookingcomListingUrl?: string;
  vrboListingUrl?: string;
  expediaListingUrl?: string;
  tripcomListingUrl?: string;
  listingImages: Array<{ url: string; caption: string | null }>;
  images: Array<{ url: string; caption: string | null }>;
  listingAmenities: Array<{ id: number; amenityName: string }>;
}

function pictureUrl(p: GuestyPicture | string | undefined): string | null {
  if (!p) return null;
  if (typeof p === "string") return p || null;
  return p.original || p.regular || p.thumbnail || null;
}

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function normalizeGuestyListing(
  raw: GuestyRawListing,
): NormalizedGuestyListing {
  const addr = raw.address || {};
  const picsRaw = (
    raw.pictures && raw.pictures.length
      ? raw.pictures
      : raw.picture
        ? [raw.picture as GuestyPicture]
        : []
  ) as GuestyPicture[];

  const images = picsRaw
    .map((p) => ({
      url: pictureUrl(p) || "",
      caption: (typeof p === "object" && p?.caption) || null,
    }))
    .filter((img) => !!img.url);

  const cleaningFee = toNumberOrNull(raw.prices?.cleaningFee);
  const feeCurrency =
    typeof raw.prices?.currency === "string" && raw.prices.currency
      ? raw.prices.currency
      : null;
  // Guesty already returns prices/terms; they were being dropped here, which
  // left 8 of 10 listings with no rate to show on a card.
  const basePrice = toNumberOrNull(raw.prices?.basePrice);
  const minNights = toNumberOrNull(raw.terms?.minNights);

  // Map Open API integrations[] → per-channel listing URLs, mirroring the
  // field names Hostaway already exposes so the detail-page column
  // renderer consumes them transparently. tripcomListingUrl is new
  // because Trip.com isn't a Hostaway channel.
  let airbnbListingUrl: string | undefined;
  let bookingcomListingUrl: string | undefined;
  let vrboListingUrl: string | undefined;
  let expediaListingUrl: string | undefined;
  let tripcomListingUrl: string | undefined;
  // Strip trailing digits so `airbnb`, `airbnb2`, `airbnb3`, … all collapse
  // to the same family. Case-insensitive throughout.
  for (const entry of raw.integrations || []) {
    const url = entry?.externalUrl;
    if (typeof url !== "string" || !url) continue;
    const family = (entry?.platform || "").toLowerCase().replace(/\d+$/, "");
    switch (family) {
      case "airbnb":
        airbnbListingUrl = url;
        break;
      case "bookingcom":
      case "booking":
        bookingcomListingUrl = url;
        break;
      case "homeaway":
      case "vrbo":
        vrboListingUrl = url;
        break;
      case "expedia":
        expediaListingUrl = url;
        break;
      case "tripcom":
      case "trip":
        tripcomListingUrl = url;
        break;
      default:
        break;
    }
  }

  return {
    id: String(raw._id),
    source: "guesty",
    name: raw.title || raw.nickname || "Untitled",
    nickname: raw.nickname,
    description: raw.publicDescription?.summary || raw.publicDescription?.space,
    city: addr.city,
    state: addr.state,
    countryCode: addr.country,
    personCapacity: raw.accommodates,
    bedroomsNumber: raw.bedrooms,
    bathroomsNumber: raw.bathrooms,
    lat: addr.lat,
    lng: addr.lng,
    address: addr.full,
    cleaningFee,
    feeCurrency,
    price: basePrice,
    minNights,
    currencyCode: feeCurrency,
    airbnbListingUrl,
    bookingcomListingUrl,
    vrboListingUrl,
    expediaListingUrl,
    tripcomListingUrl,
    roomType: raw.roomType
      ? raw.roomType
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : raw.propertyType,
    listingImages: images,
    images,
    listingAmenities: (raw.amenities || []).map((a, i) => ({
      id: i,
      amenityName: a,
    })),
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

// Subset of fields we need from the Open API listings payload. Keeping the
// projection minimal limits payload size and avoids accidental dependence on
// fields we don't need.
const LISTING_FIELDS = [
  "_id",
  "title",
  "nickname",
  "propertyType",
  "roomType",
  "amenities",
  "bathrooms",
  "accommodates",
  "bedrooms",
  "active",
  "listed",
  "address",
  "picture",
  "pictures",
  "prices",
  "terms",
  "publicDescription",
  "integrations",
].join(" ");

// Hard block-list of Guesty listing IDs that should never appear on the site,
// regardless of their active/listed status upstream. Used to suppress test
// listings, deprecated rooms, etc. Keep small and explicit.
const EXCLUDED_GUESTY_LISTING_IDS = new Set<string>([
  "6a13f06c2db0240011cf1d53",
  "6a108e55a8ffeb0015d40517",
]);

function isPublic(raw: GuestyRawListing): boolean {
  console.log(`raw._id: ${raw._id}`);

  if (raw._id && EXCLUDED_GUESTY_LISTING_IDS.has(raw._id)) {
    console.log(
      `[guesty-listings] Skipped excluded listing ${raw._id} (block-list).`,
    );
    return false;
  }
  // Treat missing flags as "yes, show it" so we don't accidentally hide
  // legitimate listings if Guesty stops returning the field for some types.
  const active = raw.active !== false;
  const listed = raw.listed !== false;
  return active && listed;
}

const LISTINGS_CACHE_TTL_MS = 10 * 60 * 1000;
const LISTINGS_CACHE_TTL_SECONDS = LISTINGS_CACHE_TTL_MS / 1000;
const LISTINGS_KV_PREFIX = "guesty:listings:v2:";
const LISTING_KV_PREFIX = "guesty:listing:v2:";

interface ListingsCacheEntry {
  data: NormalizedGuestyListing[];
  expires_at: number;
}

interface ListingCacheEntry {
  data: NormalizedGuestyListing;
  expires_at: number;
}

const listingsCache = new Map<string, ListingsCacheEntry>();
const listingCache = new Map<string, ListingCacheEntry>();

// In-process single-flight: collapses concurrent identical requests
// within the same lambda instance into one upstream call.
const inFlightListings = new Map<string, Promise<NormalizedGuestyListing[]>>();
const inFlightListing = new Map<
  string,
  Promise<NormalizedGuestyListing | null>
>();

function ageSeconds(expiresAt: number): number {
  return Math.max(
    0,
    Math.round((Date.now() - (expiresAt - LISTINGS_CACHE_TTL_MS)) / 1000),
  );
}

export async function getGuestyListings(
  params?: URLSearchParams,
): Promise<NormalizedGuestyListing[]> {
  const cacheKey = params?.toString() || "";

  // 1. Fresh in-memory hit
  const memEntry = listingsCache.get(cacheKey);
  if (memEntry && memEntry.expires_at > Date.now()) {
    console.log(
      `[guesty-listings] Returned listings from this lambda's memory. (key: "${cacheKey}", age: ${ageSeconds(memEntry.expires_at)}s)`,
    );
    return memEntry.data;
  }

  // 2. Coalesce concurrent in-process requests
  const inFlight = inFlightListings.get(cacheKey);
  if (inFlight) {
    console.log(
      `[guesty-listings] Another request in this lambda is already loading the same listings. Waiting for that one. (key: "${cacheKey}")`,
    );
    return inFlight;
  }

  const promise = (async () => {
    try {
      // 3. Fresh KV hit (cross-lambda)
      const kvKey = LISTINGS_KV_PREFIX + cacheKey;
      const kvCached = await getJson<ListingsCacheEntry>(kvKey);
      if (kvCached && kvCached.expires_at > Date.now()) {
        listingsCache.set(cacheKey, kvCached);
        console.log(
          `[guesty-listings] Returned listings from Upstash (saved by another lambda). (key: "${cacheKey}", age: ${ageSeconds(kvCached.expires_at)}s)`,
        );
        return kvCached.data;
      }

      // 4. Upstream fetch
      console.log(
        `[guesty-listings] Asking Guesty for listings... (key: "${cacheKey}")`,
      );
      const t0 = Date.now();
      const qs = new URLSearchParams(params?.toString() || "");
      if (!qs.has("fields")) qs.set("fields", LISTING_FIELDS);
      const res = await openApiFetch(`/listings?${qs.toString()}`);
      if (!res.ok) {
        const dur = Date.now() - t0;
        await res.text().catch(() => "");
        console.warn(
          `[guesty-listings] Guesty returned status ${res.status} when asking for listings. (key: "${cacheKey}", took ${dur}ms)`,
        );
        throw new GuestyOpenApiAuthError(
          `Guesty listings error: HTTP ${res.status}`,
          res.status,
        );
      }
      const json = await res.json();
      const results: GuestyRawListing[] =
        json.results || json.data || (Array.isArray(json) ? json : []);
      const normalized = results.filter(isPublic).map(normalizeGuestyListing);
      const dur = Date.now() - t0;
      console.log(
        `[guesty-listings] Got ${normalized.length} listings from Guesty. (key: "${cacheKey}", took ${dur}ms)`,
      );

      const entry: ListingsCacheEntry = {
        data: normalized,
        expires_at: Date.now() + LISTINGS_CACHE_TTL_MS,
      };
      listingsCache.set(cacheKey, entry);
      // Best-effort KV write; failures already logged inside cache layer.
      await setJson(kvKey, entry, LISTINGS_CACHE_TTL_SECONDS);
      return normalized;
    } finally {
      inFlightListings.delete(cacheKey);
    }
  })();

  inFlightListings.set(cacheKey, promise);
  return promise;
}

export function getCachedGuestyListings(
  params?: URLSearchParams,
): NormalizedGuestyListing[] | null {
  const cacheKey = params?.toString() || "";
  const entry = listingsCache.get(cacheKey);
  if (!entry) return null;
  // Even past TTL we still return — used as stale-on-failure fallback.
  return entry.data;
}

export async function getGuestyListingById(
  id: string,
): Promise<NormalizedGuestyListing | null> {
  // 1. Fresh in-memory hit
  const memEntry = listingCache.get(id);
  if (memEntry && memEntry.expires_at > Date.now()) {
    console.log(
      `[guesty-listings] Returned listing from this lambda's memory. (key: "${id}", age: ${ageSeconds(memEntry.expires_at)}s)`,
    );
    return memEntry.data;
  }

  // 2. Coalesce concurrent in-process requests
  const inFlight = inFlightListing.get(id);
  if (inFlight) {
    console.log(
      `[guesty-listings] Another request in this lambda is already loading the same listing. Waiting for that one. (key: "${id}")`,
    );
    return inFlight;
  }

  const promise = (async () => {
    try {
      // 3. Fresh KV hit (cross-lambda)
      const kvKey = LISTING_KV_PREFIX + id;
      const kvCached = await getJson<ListingCacheEntry>(kvKey);
      if (kvCached && kvCached.expires_at > Date.now()) {
        listingCache.set(id, kvCached);
        console.log(
          `[guesty-listings] Returned listing from Upstash (saved by another lambda). (key: "${id}", age: ${ageSeconds(kvCached.expires_at)}s)`,
        );
        return kvCached.data;
      }

      // 4. Upstream fetch
      console.log(
        `[guesty-listings] Asking Guesty for listing... (key: "${id}")`,
      );
      const t0 = Date.now();
      const qs = new URLSearchParams({ fields: LISTING_FIELDS });
      const res = await openApiFetch(
        `/listings/${encodeURIComponent(id)}?${qs.toString()}`,
      );

      if (res.status === 404) {
        const dur = Date.now() - t0;
        console.log(
          `[guesty-listings] Guesty has no listing with that id. (key: "${id}", took ${dur}ms)`,
        );
        return null;
      }

      if (!res.ok) {
        const dur = Date.now() - t0;
        await res.text().catch(() => "");
        console.warn(
          `[guesty-listings] Guesty returned status ${res.status} when asking for a listing. (key: "${id}", took ${dur}ms)`,
        );
        throw new GuestyOpenApiAuthError(
          `Guesty listing error: HTTP ${res.status}`,
          res.status,
        );
      }

      const json = await res.json();
      const raw: GuestyRawListing = json.result || json.data || json;
      if (!raw || !raw._id) return null;
      if (!isPublic(raw)) return null;
      const normalized = normalizeGuestyListing(raw);
      const dur = Date.now() - t0;
      console.log(
        `[guesty-listings] Got the listing from Guesty. (key: "${id}", took ${dur}ms)`,
      );

      const entry: ListingCacheEntry = {
        data: normalized,
        expires_at: Date.now() + LISTINGS_CACHE_TTL_MS,
      };
      listingCache.set(id, entry);
      await setJson(kvKey, entry, LISTINGS_CACHE_TTL_SECONDS);
      return normalized;
    } finally {
      inFlightListing.delete(id);
    }
  })();

  inFlightListing.set(id, promise);
  return promise;
}

export function isGuestyId(id: string): boolean {
  return /^[a-f0-9]{24}$/i.test(id);
}
