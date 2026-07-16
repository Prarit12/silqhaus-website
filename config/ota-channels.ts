export interface OTAChannel {
  id: number;
  slug: string;
  name: string;
  color: string;
}

export const OTA_CHANNELS: Record<number, OTAChannel> = {
  2018: { id: 2018, slug: "airbnb", name: "Airbnb", color: "#FF5A5F" },
  2002: { id: 2002, slug: "vrbo", name: "Vrbo", color: "#3D67A6" },
  2005: { id: 2005, slug: "bookingcom", name: "Booking.com", color: "#003580" },
  2007: { id: 2007, slug: "expedia", name: "Expedia", color: "#FFCC00" },
  2009: { id: 2009, slug: "vrbo", name: "Vrbo", color: "#3D67A6" },
  2010: { id: 2010, slug: "vrbo", name: "Vrbo", color: "#3D67A6" },
  2000: { id: 2000, slug: "direct", name: "Direct", color: "#7e6725" },
  2013: {
    id: 2013,
    slug: "bookingengine",
    name: "Booking Engine",
    color: "#7e6725",
  },
  2015: { id: 2015, slug: "custom", name: "Custom", color: "#7e6725" },
  2016: {
    id: 2016,
    slug: "tripadvisor",
    name: "TripAdvisor",
    color: "#34E0A1",
  },
  2017: { id: 2017, slug: "wordpress", name: "WordPress", color: "#21759B" },
  2019: { id: 2019, slug: "marriott", name: "Marriott", color: "#1C1C1C" },
  2020: { id: 2020, slug: "partner", name: "Partner", color: "#7e6725" },
  2021: { id: 2021, slug: "gds", name: "GDS", color: "#7e6725" },
  2022: { id: 2022, slug: "google", name: "Google", color: "#4285F4" },
};

export function getChannelName(channelId: number): string {
  return OTA_CHANNELS[channelId]?.name || "Other";
}

export function getChannelSlug(channelId: number): string {
  return OTA_CHANNELS[channelId]?.slug || "other";
}

export function getChannelColor(channelId: number): string {
  return OTA_CHANNELS[channelId]?.color || "#7e6725";
}

export type OTAUrlKey =
  | "airbnbListingUrl"
  | "vrboListingUrl"
  | "bookingcomListingUrl"
  | "expediaListingUrl"
  | "googleVrListingUrl";

const CHANNEL_URL_MAP: Record<string, OTAUrlKey> = {
  airbnb: "airbnbListingUrl",
  vrbo: "vrboListingUrl",
  bookingcom: "bookingcomListingUrl",
  expedia: "expediaListingUrl",
  google: "googleVrListingUrl",
};

export function buildListingNameMap(
  listings: Array<{ id: number; name: string }>,
): Record<number, string> {
  const map: Record<number, string> = {};
  for (const l of listings) {
    map[l.id] = l.name;
  }
  return map;
}

export function getOTAListingUrl(
  channelId: number,
  property: Record<string, unknown>,
): string | null {
  const slug = getChannelSlug(channelId);
  const urlKey = CHANNEL_URL_MAP[slug];
  if (!urlKey) return null;
  const url = property[urlKey];
  return typeof url === "string" && url.length > 0 ? url : null;
}
