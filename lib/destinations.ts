import { getHostAwayListings } from "@/lib/hostaway/listings";
import { getGuestyListings } from "@/lib/guesty/listings";
import {
  DESTINATION_REGIONS,
  type DestinationRegion,
} from "@/config/destination-regions";

/** The slim, server-side listing shape the destination pages render. */
export interface DestinationListing {
  id: number | string;
  source: "hostaway" | "guesty";
  name: string;
  nickname?: string;
  city?: string;
  state?: string;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  personCapacity?: number;
  averageReviewRating?: number;
  imageUrl?: string;
}

function slim(l: any, source: "hostaway" | "guesty"): DestinationListing {
  return {
    id: l.id,
    source,
    name: l.name ?? "",
    nickname: l.nickname ?? undefined,
    city: l.city ?? undefined,
    state: l.state ?? undefined,
    bedroomsNumber: l.bedroomsNumber ?? undefined,
    bathroomsNumber: l.bathroomsNumber ?? undefined,
    personCapacity: l.personCapacity ?? undefined,
    averageReviewRating:
      Number(l.averageReviewRating) > 0
        ? Number(l.averageReviewRating)
        : undefined,
    imageUrl: l.listingImages?.[0]?.url ?? undefined,
  };
}

/** Every live vacation-rental listing from both PMSes, slimmed for SSR.
 *  Either source failing degrades to the other instead of a 500. */
export async function getAllVacationListings(): Promise<DestinationListing[]> {
  const [hostaway, guesty] = await Promise.allSettled([
    getHostAwayListings() as Promise<{ result: any[] }>,
    getGuestyListings(),
  ]);
  const ha =
    hostaway.status === "fulfilled"
      ? (hostaway.value?.result ?? []).map((l: any) => slim(l, "hostaway"))
      : [];
  const gu =
    guesty.status === "fulfilled"
      ? (guesty.value ?? []).map((l: any) => slim(l, "guesty"))
      : [];
  return [...ha, ...gu];
}

export function listingsForRegion(
  all: DestinationListing[],
  region: DestinationRegion,
): DestinationListing[] {
  return all.filter((l) =>
    region.match.test(`${l.name} ${l.city ?? ""} ${l.state ?? ""}`),
  );
}

export function regionCounts(
  all: DestinationListing[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of DESTINATION_REGIONS) {
    counts[r.key] = listingsForRegion(all, r).length;
  }
  return counts;
}
