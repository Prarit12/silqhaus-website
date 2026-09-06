import { getVacationListingsWithStatus } from "@/lib/destinations";
import { VacationSearch } from "@/components/vacation-search/vacation-search";
import type { PropertyListItem } from "@/hooks/use-property-filters";

// Listings change on PMS edits, not per request. An hour of ISR keeps the
// upstream fetch off the critical path while the page still server-renders.
export const revalidate = 3600;

export default async function OurProperty() {
  // Seeds the grid so the server HTML carries the property cards and their
  // links. Slim on purpose: the raw PMS payload is ~280 KB for these same
  // listings, this shape is ~4 KB, and the client refetch fills in the rest.
  //
  // A partial fetch is not worth caching for an hour — one PMS being down
  // would bake a page advertising 1 property instead of 10. Seed only a
  // complete answer; otherwise fall back to the client fetch, which is what
  // this page did for every visitor before it server-rendered at all.
  const { listings, complete } = await getVacationListingsWithStatus();

  return (
    <VacationSearch
      initialListings={complete ? (listings as PropertyListItem[]) : []}
    />
  );
}
