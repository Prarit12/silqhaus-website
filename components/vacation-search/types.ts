import type { PropertyListItem } from "@/hooks/use-property-filters";
import type { FromQuote } from "@/components/property-card";
import type { LatLng, Region } from "./geo";

/**
 * One property, fully resolved for the search page: identity, coordinates,
 * region, and every price the UI needs — computed once in the orchestrator so
 * the grid card, the map pill, and the popup can never disagree.
 */
export interface SearchItem {
  key: string;
  property: PropertyListItem;
  /** calendarData[id] with the Silqhaus markup already applied (dated), or null. */
  cardPricing: any;
  fromQuote: FromQuote | null;
  hasDates: boolean;
  isUnavailable: boolean;
  latLng: LatLng | null;
  region: Region;
  /** Nightly figure shown on the map pill (dated avg, else from-quote avg). */
  nightly: number | null;
}
