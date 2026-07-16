export interface OTAMarkup {
  name: string;
  slug: string;
  markupPercentage: number;
  color: string;
  logo?: string;
}

export const OTA_MARKUPS: OTAMarkup[] = [
  {
    name: "Silqhaus Direct",
    slug: "silqhaus",
    markupPercentage: 0,
    color: "#7e6725",
  },
  {
    name: "Airbnb",
    slug: "airbnb",
    markupPercentage: 19,
    color: "#FF5A5F",
  },
  {
    name: "Booking.com",
    slug: "booking",
    markupPercentage: 20,
    color: "#003580",
  },
  {
    name: "VRBO",
    slug: "vrbo",
    markupPercentage: 20,
    color: "#0E5DBC",
  },
  {
    name: "Google",
    slug: "google",
    markupPercentage: 15,
    color: "#4285F4",
  },
  {
    name: "Expedia",
    slug: "expedia",
    markupPercentage: 20,
    color: "#FFCC00",
  },
  {
    name: "Trip.com",
    slug: "tripcom",
    markupPercentage: 18,
    color: "#287DFA",
  },
];

export const BOOKING_COM_URLS: Record<number, string> = {
  383332:
    "https://www.booking.com/hotel/th/unblock-1br-pool-view-1min-walk-to-boat-avenue.html",
  383333: "https://www.booking.com/hotel/th/zcapex2-by-silqhaus.html",
  383434: "https://www.booking.com/hotel/th/bs-villa-luxury-sea-view.html",
  424589:
    "https://www.booking.com/hotel/th/zire-wongamat-pattaya-by-silqhaus.html",
  435922:
    "https://www.booking.com/hotel/th/luxurious-phuket-escape-lakewood-hills.html",
  439591: "https://www.booking.com/hotel/th/zcape-1-by-silqhaus.html",
  439592:
    "https://www.booking.com/hotel/th/the-base-pattaya-brand-new-amp-unblock-view.html",
  457051:
    "https://www.booking.com/hotel/th/modern-tropical-private-pool-villa-sai-yuan-rawai.html",
  457054:
    "https://www.booking.com/hotel/th/modern-tropical-pool-villa-saiyuan-164.html",

  469428:
    "https://www.booking.com/hotel/th/niva-villa-modern-amp-lake-view-near-phuket-town-tambl-rasdaa.html",
};

export const GUESTY_OTA_MARKUPS: Record<
  "airbnb" | "booking" | "vrbo" | "expedia" | "tripcom",
  number
> = {
  airbnb: 39,
  booking: 29,
  vrbo: 29,
  expedia: 29,
  tripcom: 29,
};

export type SilqhausMarkupSource = "hostaway" | "guesty";

export const HOSTAWAY_SILQHAUS_MARKUP_PERCENTAGE = 10;
export const GUESTY_SILQHAUS_MARKUP_PERCENTAGE = 10;

export const getSilqhausMarkupPercentage = (
  source: SilqhausMarkupSource,
): number =>
  source === "guesty"
    ? GUESTY_SILQHAUS_MARKUP_PERCENTAGE
    : HOSTAWAY_SILQHAUS_MARKUP_PERCENTAGE;

export const calculateSilqhausPrice = (
  basePrice: number,
  extraGuestCost: number,
  cleaningFee: number,
  source: SilqhausMarkupSource,
): number => {
  const markedUpBase =
    basePrice * (1 + getSilqhausMarkupPercentage(source) / 100);
  return Math.ceil(markedUpBase + extraGuestCost + cleaningFee);
};

export const calculateOTAPrice = (
  basePrice: number,
  markupPercentage: number,
  extraGuestCost: number = 0,
  cleaningFee: number = 0,
): number => {
  const markedUpBase = basePrice * (1 + markupPercentage / 100);
  return Math.ceil(markedUpBase + extraGuestCost + cleaningFee);
};

export const getOTAPrices = (
  basePrice: number,
  extraGuestCost: number,
  cleaningFee: number,
  source: SilqhausMarkupSource,
): {
  name: string;
  slug: string;
  price: number;
  color: string;
  savings?: number;
}[] => {
  const silqhausPrice = calculateSilqhausPrice(
    basePrice,
    extraGuestCost,
    cleaningFee,
    source,
  );

  return OTA_MARKUPS.map((ota) => {
    if (ota.slug === "silqhaus") {
      return {
        name: ota.name,
        slug: ota.slug,
        price: silqhausPrice,
        color: ota.color,
        savings: undefined,
      };
    }

    const price = calculateOTAPrice(
      basePrice,
      ota.markupPercentage,
      extraGuestCost,
      cleaningFee,
    );
    const savings = price - silqhausPrice;

    return {
      name: ota.name,
      slug: ota.slug,
      price,
      color: ota.color,
      savings,
    };
  });
};
