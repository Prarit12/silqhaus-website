export type PMSListingType = "RENT" | "SALE";

export interface PMSMedia {
  url: string;
  altText?: string | null;
  sortOrder?: number | null;
  isCover?: boolean | null;
  kind?: string | null;
  mimeType?: string | null;
}

export interface PMSListing {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  listingType: PMSListingType[];
  propertyType?: string | null;
  status?: string | null;
  salePrice?: number | null;
  rentPrice?: number | null;
  rentPricePeriod?: string | null;
  rentPriceYearly?: number | null;
  rentPriceMidterm?: number | null;
  rentPriceMonthly?: number | null;
  currency?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqm?: number | null;
  lotSizeSqm?: number | null;
  yearBuilt?: number | null;
  parkingSpaces?: number | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  subdistrict?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  features?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
  media?: PMSMedia[] | null;
}

export interface PMSPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PMSListingsResponse {
  data: PMSListing[];
  pagination: PMSPagination;
}

const DEFAULT_BASE_URL = "https://silqhaus-property-management-hub.replit.app";

function getBaseUrl(): string {
  return (
    process.env.SILQHAUS_PMS_API_BASE_URL?.replace(/\/$/, "") ||
    DEFAULT_BASE_URL
  );
}

function getApiKey(): string {
  const key = process.env.SILQHAUS_PMS_API_KEY;
  if (!key) {
    throw new Error("SILQHAUS_PMS_API_KEY is not configured");
  }
  return key;
}

async function pmsRequest<T>(path: string): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-Key": getApiKey(),
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Silqhaus PMS API ${res.status} ${res.statusText}: ${body.slice(0, 200)}`,
    );
  }
  return (await res.json()) as T;
}

export interface FetchListingsOptions {
  type?: PMSListingType;
  page?: number;
  pageSize?: number;
  sort?: "createdAt" | "price";
  order?: "asc" | "desc";
}

export async function fetchListings(
  opts: FetchListingsOptions = {},
): Promise<PMSListingsResponse> {
  const params = new URLSearchParams();
  if (opts.type) params.set("type", opts.type);
  params.set("page", String(opts.page ?? 1));
  params.set("pageSize", String(opts.pageSize ?? 50));
  params.set("sort", opts.sort ?? "createdAt");
  params.set("order", opts.order ?? "desc");
  return pmsRequest<PMSListingsResponse>(
    `/api/v1/public/listings?${params.toString()}`,
  );
}

export async function fetchListing(idOrSlug: string): Promise<PMSListing> {
  return pmsRequest<PMSListing>(
    `/api/v1/public/listings/${encodeURIComponent(idOrSlug)}`,
  );
}

export async function fetchSimilarListings(
  idOrSlug: string,
  reference?: PMSListing,
  limit = 4,
): Promise<PMSListing[]> {
  try {
    const upstream = await pmsRequest<PMSListing[]>(
      `/api/v1/public/listings/${encodeURIComponent(idOrSlug)}/similar`,
    );
    if (Array.isArray(upstream)) {
      return upstream.slice(0, limit);
    }
  } catch (err) {
    console.warn(
      "[silqhaus-pms] /similar endpoint failed, falling back to client-side similarity:",
      err instanceof Error ? err.message : err,
    );
  }

  if (!reference) {
    return [];
  }

  const refType: PMSListingType | undefined = reference.listingType?.includes(
    "RENT",
  )
    ? "RENT"
    : reference.listingType?.includes("SALE")
      ? "SALE"
      : undefined;

  try {
    const { data } = await fetchListings({
      type: refType,
      page: 1,
      pageSize: 50,
      sort: "createdAt",
      order: "desc",
    });

    const candidates = data.filter(
      (l) => l.id !== reference.id && l.slug !== reference.slug,
    );

    const scored = candidates
      .map((l) => {
        let score = 0;
        if (
          reference.propertyType &&
          l.propertyType === reference.propertyType
        ) {
          score += 4;
        }
        if (reference.city && l.city === reference.city) score += 3;
        if (reference.state && l.state === reference.state) score += 2;
        if (reference.country && l.country === reference.country) score += 1;
        return { l, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((s) => s.l);

    return scored.slice(0, limit);
  } catch (err) {
    console.error(
      "[silqhaus-pms] similar listings fallback failed:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}
