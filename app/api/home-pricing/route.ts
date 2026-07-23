import { getHostAwayListings, getHostAwayCalendar } from "@/lib/hostaway/listings";
import { getGuestyListings } from "@/lib/guesty/listings";
import { getGuestyBulkCalendar } from "@/lib/guesty/calendar";
import { calculateSilqhausPrice } from "@/config/ota-markups";

/**
 * "From" pricing for cards that have no guest-selected dates.
 *
 * The listing-level `price` field is a base rate, not a bookable one — on
 * Hostaway it was out by up to 6x against the real calendar. So every figure
 * here comes from the calendar: we walk forward from tomorrow, find the first
 * run of consecutive open nights long enough to satisfy that date's minimum
 * stay, and add up the real nightly rates for exactly that many nights.
 *
 * Totals carry the same Silqhaus markup and cleaning fee the booking flow
 * charges, so the card never quotes less than checkout will.
 *
 * The result is a number a guest could actually book — "฿69,904 for 3 nights".
 */

/** How far ahead to look for an opening before giving up on a listing. */
const WINDOW_DAYS = 180;
/** Skip anything asking for a longer minimum than this (monthly-only units). */
const MAX_MIN_NIGHTS = 30;

export const revalidate = 3600;

type Quote = {
  key: string;
  nights: number;
  total: number;
  avgNightly: number;
  currency: string;
  checkIn: string;
  checkOut: string;
};

type Day = {
  date: string;
  price: number | null;
  minNights: number;
  available: boolean;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};

/**
 * First bookable stay in a day list: the earliest start whose minimum-stay run
 * is fully open and fully priced. Days must already be sorted by date.
 */
function firstBookableStay(days: Day[]): Omit<Quote, "key" | "currency"> | null {
  for (let i = 0; i < days.length; i++) {
    if (!days[i].available || !days[i].price) continue;

    const nights = Math.max(1, days[i].minNights || 1);
    if (nights > MAX_MIN_NIGHTS || i + nights > days.length) continue;

    let total = 0;
    let ok = true;
    for (let j = i; j < i + nights; j++) {
      if (!days[j].available || !days[j].price) {
        ok = false;
        // Nothing starting before the blocked night can span it either.
        i = j;
        break;
      }
      total += days[j].price as number;
    }
    if (!ok || total <= 0) continue;

    return {
      nights,
      total: Math.round(total),
      avgNightly: Math.round(total / nights),
      checkIn: days[i].date,
      checkOut: addDays(days[i].date, nights),
    };
  }
  return null;
}

/**
 * Same arithmetic the booking flow runs, so the card and checkout agree.
 * There is no guest count on a card, so the extra-guest fee is left at zero.
 */
function withMarkup(
  stay: Omit<Quote, "key" | "currency">,
  cleaningFee: number,
  source: "hostaway" | "guesty",
) {
  const total = calculateSilqhausPrice(stay.total, 0, cleaningFee, source);
  return {
    ...stay,
    total,
    avgNightly: Math.round(total / stay.nights),
  };
}

async function hostawayQuotes(startDate: string, endDate: string): Promise<Quote[]> {
  const res = await getHostAwayListings();
  const listings: any[] = res?.result ?? [];

  const settled = await Promise.allSettled(
    listings.map(async (listing) => {
      const cal = await getHostAwayCalendar(String(listing.id), startDate, endDate);
      const days: Day[] = (cal?.result ?? [])
        .map((d: any) => ({
          date: String(d.date),
          price: typeof d.price === "number" ? d.price : Number(d.price) || null,
          minNights: Number(d.minimumStay) || Number(listing.minNights) || 1,
          available: d.isAvailable === 1 || d.status === "available",
        }))
        .sort((a: Day, b: Day) => a.date.localeCompare(b.date));

      const stay = firstBookableStay(days);
      if (!stay) return null;
      return {
        key: `hostaway:${listing.id}`,
        currency: listing.currencyCode || "THB",
        ...withMarkup(stay, Number(listing.cleaningFee) || 0, "hostaway"),
      };
    }),
  );

  return settled
    .filter(
      (r): r is PromiseFulfilledResult<Quote> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value);
}

async function guestyQuotes(startDate: string, endDate: string): Promise<Quote[]> {
  const listings = await getGuestyListings();
  const ids = listings.map((l) => String(l.id)).filter(Boolean);
  if (!ids.length) return [];

  const calendars = await getGuestyBulkCalendar(ids, startDate, endDate);
  const minNightsById = new Map(
    listings.map((l) => [String(l.id), Number(l.minNights) || 1]),
  );
  const cleaningFeeById = new Map(
    listings.map((l) => [String(l.id), Number(l.cleaningFee) || 0]),
  );

  const quotes: Quote[] = [];
  for (const cal of calendars) {
    const days: Day[] = (cal.days ?? [])
      .map((d) => ({
        date: String(d.date),
        price: typeof d.price === "number" ? d.price : null,
        minNights: Number(d.minNights) || minNightsById.get(cal.listingId) || 1,
        available: !d.isBlocked,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const stay = firstBookableStay(days);
    if (!stay) continue;
    quotes.push({
      key: `guesty:${cal.listingId}`,
      currency: cal.currency || "THB",
      ...withMarkup(stay, cleaningFeeById.get(cal.listingId) ?? 0, "guesty"),
    });
  }
  return quotes;
}

export async function GET() {
  const startDate = addDays(iso(new Date()), 1);
  const endDate = addDays(startDate, WINDOW_DAYS);

  const [ha, gu] = await Promise.allSettled([
    hostawayQuotes(startDate, endDate),
    guestyQuotes(startDate, endDate),
  ]);

  if (ha.status === "rejected") {
    console.error("[home-pricing] hostaway failed:", ha.reason);
  }
  if (gu.status === "rejected") {
    console.error("[home-pricing] guesty failed:", gu.reason);
  }

  const quotes = [
    ...(ha.status === "fulfilled" ? ha.value : []),
    ...(gu.status === "fulfilled" ? gu.value : []),
  ];

  // Keyed by `${source}:${id}` so a card can look itself up directly.
  const byKey: Record<string, Omit<Quote, "key">> = {};
  for (const { key, ...rest } of quotes) byKey[key] = rest;

  return Response.json(byKey, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
