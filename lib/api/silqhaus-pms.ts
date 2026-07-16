import type {
  PMSListing,
  PMSListingsResponse,
  PMSListingType,
} from "@/lib/silqhaus-pms/listings";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  THB: "฿",
  EUR: "€",
  GBP: "£",
};

export function currencySymbol(code?: string | null): string {
  if (!code) return "";
  return CURRENCY_SYMBOLS[code.toUpperCase()] ?? `${code} `;
}

export type PMSPriceSide = "rent" | "sale";

export type PMSPriceTier = "yearly" | "midterm" | "monthly" | "legacy" | "sale";

export interface PMSPriceLine {
  tier: PMSPriceTier;
  label: string | null;
  amount: string;
}

export interface PMSPriceLabels {
  yearly?: string;
  midterm?: string;
  monthly?: string;
  perMonth?: string;
}

function legacyRentSuffix(
  period: string | null | undefined,
  perMonthLabel: string,
): string {
  if (period === "MONTH") return ` ${perMonthLabel}`;
  if (period) return ` / ${period.toLowerCase()}`;
  return "";
}

function buildRentLines(
  listing: PMSListing,
  sym: string,
  labels: PMSPriceLabels,
): PMSPriceLine[] {
  const perMo = labels.perMonth ? ` ${labels.perMonth}` : "";
  const lines: PMSPriceLine[] = [];
  if (listing.rentPriceYearly != null) {
    lines.push({
      tier: "yearly",
      label: labels.yearly ?? null,
      amount: `${sym}${listing.rentPriceYearly.toLocaleString()}${perMo}`,
    });
  }
  if (listing.rentPriceMidterm != null) {
    lines.push({
      tier: "midterm",
      label: labels.midterm ?? null,
      amount: `${sym}${listing.rentPriceMidterm.toLocaleString()}${perMo}`,
    });
  }
  if (listing.rentPriceMonthly != null) {
    lines.push({
      tier: "monthly",
      label: labels.monthly ?? null,
      amount: `${sym}${listing.rentPriceMonthly.toLocaleString()}${perMo}`,
    });
  }
  if (lines.length === 0 && listing.rentPrice != null) {
    const suffix = legacyRentSuffix(
      listing.rentPricePeriod,
      labels.perMonth ?? "/ mo",
    );
    lines.push({
      tier: "legacy",
      label: null,
      amount: `${sym}${listing.rentPrice.toLocaleString()}${suffix}`,
    });
  }
  return lines;
}

function buildSaleLines(listing: PMSListing, sym: string): PMSPriceLine[] {
  if (listing.salePrice == null) return [];
  return [
    {
      tier: "sale",
      label: null,
      amount: `${sym}${listing.salePrice.toLocaleString()}`,
    },
  ];
}

export function getPMSPriceLines(
  listing: PMSListing,
  preferredSide: PMSPriceSide,
  labels: PMSPriceLabels = {},
): PMSPriceLine[] {
  const sym = currencySymbol(listing.currency);
  const rent = buildRentLines(listing, sym, labels);
  const sale = buildSaleLines(listing, sym);
  if (preferredSide === "rent") {
    return rent.length > 0 ? rent : sale;
  }
  return sale.length > 0 ? sale : rent;
}

export function getPMSPrimaryPriceLine(
  listing: PMSListing,
  preferredSide: PMSPriceSide,
  labels: PMSPriceLabels = {},
): PMSPriceLine | null {
  const lines = getPMSPriceLines(listing, preferredSide, labels);
  if (lines.length === 0) return null;
  if (preferredSide !== "rent" || lines[0].tier === "sale") return lines[0];
  // For rent cards, prefer Yearly > Midterm > Monthly > legacy
  const order: PMSPriceTier[] = ["yearly", "midterm", "monthly", "legacy"];
  for (const tier of order) {
    const found = lines.find((l) => l.tier === tier);
    if (found) return found;
  }
  return lines[0];
}

export function formatPMSPrice(
  listing: PMSListing,
  perMonthLabel = "/ mo",
  preferredSide?: PMSPriceSide,
): string | null {
  const sym = currencySymbol(listing.currency);
  const isSale = listing.listingType?.includes("SALE");
  const side: PMSPriceSide = preferredSide ?? (isSale ? "sale" : "rent");
  const perMo = ` ${perMonthLabel}`;

  const rentPrimary = (): string | null => {
    if (listing.rentPriceMonthly != null) {
      return `${sym}${listing.rentPriceMonthly.toLocaleString()}${perMo}`;
    }
    if (listing.rentPriceMidterm != null) {
      return `${sym}${listing.rentPriceMidterm.toLocaleString()}${perMo}`;
    }
    if (listing.rentPriceYearly != null) {
      return `${sym}${listing.rentPriceYearly.toLocaleString()}${perMo}`;
    }
    if (listing.rentPrice != null) {
      const suffix = legacyRentSuffix(listing.rentPricePeriod, perMonthLabel);
      return `${sym}${listing.rentPrice.toLocaleString()}${suffix}`;
    }
    return null;
  };

  const salePrimary = (): string | null =>
    listing.salePrice != null
      ? `${sym}${listing.salePrice.toLocaleString()}`
      : null;

  if (side === "rent") {
    return rentPrimary() ?? salePrimary();
  }
  return salePrimary() ?? rentPrimary();
}

const PMS_PLACEHOLDER_IMAGE = "/placeholder-property.svg";

export function getPMSCoverImage(listing: PMSListing): string {
  const media = listing.media ?? [];
  if (media.length === 0) return PMS_PLACEHOLDER_IMAGE;
  const cover = media.find((m) => m.isCover);
  if (cover?.url) return cover.url;
  const sortedZero = media.find((m) => m.sortOrder === 0);
  if (sortedZero?.url) return sortedZero.url;
  return media[0]?.url || PMS_PLACEHOLDER_IMAGE;
}

export function getPMSGalleryImages(listing: PMSListing): string[] {
  const media = listing.media ?? [];
  return [...media]
    .sort((a, b) => {
      if (a.isCover && !b.isCover) return -1;
      if (!a.isCover && b.isCover) return 1;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    })
    .map((m) => m.url)
    .filter(Boolean);
}

export async function fetchPMSListings(
  type: PMSListingType,
): Promise<PMSListingsResponse> {
  const res = await fetch(
    `/api/silqhaus-pms/listings?type=${type}&pageSize=50&sort=createdAt&order=desc`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} listings`);
  }
  return res.json();
}

export async function fetchPMSListing(idOrSlug: string): Promise<PMSListing> {
  const res = await fetch(
    `/api/silqhaus-pms/listings/${encodeURIComponent(idOrSlug)}`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch listing ${idOrSlug}`);
  }
  return res.json();
}
