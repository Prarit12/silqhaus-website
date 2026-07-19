/**
 * Highlight data carried over from the legacy /destination pages: real
 * photography, and the blog guides spots link to. Names come from the
 * `destination.<region>.attractions.*` i18n keys so existing
 * translations keep working.
 */
export type RegionHighlight = {
  key: string;
  img: string;
  /** Blog guide backing this highlight, when one exists. */
  link?: string;
};

export const REGION_HIGHLIGHTS: Record<string, RegionHighlight[]> = {
  phuket: [
    { key: "patongBeach", img: "/photos/featured-destinations/patong.webp", link: "/guides/patong-beach-phuket-guide" },
    { key: "kataBeach", img: "/photos/featured-destinations/kata-beach.webp", link: "/guides/kata-beach-phuket-guide" },
    { key: "karonBeach", img: "/photos/featured-destinations/karon-beach.webp", link: "/guides/karon-beach-phuket-guide" },
    { key: "surinBeach", img: "/photos/featured-destinations/phuket/surin-beach-catch-beach-club-phuket.webp", link: "/guides/surin-beach-phuket" },
    { key: "kamalaBeach", img: "/photos/featured-destinations/kamala-destination-page.webp", link: "/guides/kamala-beach-phuket" },
    { key: "naiHarnBeach", img: "/photos/featured-destinations/phuket/nai-harn-beach-phuket.jpg", link: "/guides/nai-harn-beach-phuket" },
    { key: "freedomBeach", img: "/photos/featured-destinations/phuket/freedom-beach-phuket.jpg", link: "/guides/freedom-beach-phuket" },
    { key: "yaNuiBeach", img: "/photos/featured-destinations/phuket/ya-nui-beach-sideview.jpg", link: "/guides/ya-nui-beach-phuket-guide" },
    { key: "rawaiBeach", img: "/photos/featured-destinations/phuket/rawai-beach-phuket.jpg", link: "/guides/rawai-beach-phuket" },
    { key: "maiKhaoBeach", img: "/photos/featured-destinations/phuket/mai-khao-beach-plane-main.webp", link: "/guides/mai-khao-beach" },
    { key: "naiYangBeach", img: "/photos/featured-destinations/phuket/nai-yang-beach-longtail-boats.webp", link: "/guides/nai-yang-beach" },
    { key: "naiThonBeach", img: "/photos/featured-destinations/phuket/naithon-beach-phuket.webp", link: "/guides/naithon-beach-phuket" },
  ],
  pattaya: [
    { key: "pattayaBeach", img: "/pattaya/pattaya-beach.webp" },
    { key: "jomtienBeach", img: "/pattaya/jomtien-beach.webp" },
    { key: "kohLarn", img: "/pattaya/koh-larn-pattaya.webp" },
    { key: "sanctuaryOfTruth", img: "/pattaya/sanctuary_of_truth.avif", link: "/guides/sanctuary-of-truth-pattaya-complete-guide" },
    { key: "bigBuddha", img: "/pattaya/wat-phra-yai-pattaya.avif" },
    { key: "nongNooch", img: "/pattaya/nong-nooch-pattaya.jpg" },
    { key: "ramayanaWaterPark", img: "/pattaya/ramayana-water-park-pattaya.jpg" },
    { key: "floatingMarket", img: "/pattaya/pattaya-floating-marketing.webp" },
    { key: "nightMarket", img: "/pattaya/thepprasit-night-market-pattaya.jpg" },
  ],
};

/** Neighborhood keys per region — content in `guides.<region>.areas.items.*`. */
export const REGION_AREAS: Record<string, string[]> = {
  bangkok: [
    "rattanakosin",
    "riverside",
    "yaowarat",
    "khaosan",
    "dusit",
    "siam",
    "silomSathorn",
    "sukhumvit",
    "thonglor",
    "phraKhanong",
    "ari",
    "chatuchakArea",
    "ratchada",
    "bangKrachao",
  ],
};

/** Shopping group keys per region — content in `guides.<region>.shopping.groups.*`. */
export const REGION_SHOPPING: Record<string, string[]> = {
  bangkok: ["malls", "markets", "night"],
};

/** Transport item keys per region — content in `guides.<region>.transport.items.*`. */
export const REGION_TRANSPORT: Record<string, string[]> = {
  bangkok: ["airports", "airportRail", "rail", "river", "ride", "moto"],
};

/** Good-to-know tip keys per region — content in `guides.<region>.good.items.*`. */
export const REGION_GOOD: Record<string, string[]> = {
  bangkok: ["sim", "cash", "temple", "tuktuk", "water"],
};

/** Spots per category when a region goes deeper than the default three. */
export const REGION_SPOT_COUNTS: Record<string, Record<string, number>> = {
  bangkok: { culture: 6, temples: 5, islands: 4 },
};

/** Length of the numbered things-to-do checklist, when a region has one. */
export const REGION_THINGS_COUNT: Record<string, number> = {
  bangkok: 30,
};

/** Blog guides backing specific spots inside the six category sections. */
export const REGION_SPOT_GUIDES: Record<
  string,
  Record<string, Record<string, string>>
> = {
  phuket: {
    culture: { s1: "/guides/phuket-old-town-things-to-do" },
    temples: {
      s1: "/guides/wat-chalong-guide",
      s2: "/guides/big-buddha-phuket-guide",
    },
  },
  pattaya: {
    culture: { s1: "/guides/sanctuary-of-truth-pattaya-complete-guide" },
  },
};
