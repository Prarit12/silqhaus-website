/**
 * The destination landing pages (/destination/{key}) — one per region the
 * search offers. `match` decides which live listings belong to a region,
 * `searchQ` feeds the ?location= search link, `areaKeys` picks which
 * neighborhood blurbs (propertyDetail.neighborhoods) the page reuses, and
 * `hasGuide` cross-links the matching /experiences guide.
 */
export const DESTINATION_REGIONS = [
  {
    key: "phuket",
    match: /phuket/i,
    searchQ: "Phuket",
    img: "/experiences/regions/phuket.jpg",
    areaKeys: ["choengThale", "rawai", "koKaeo", "patong"],
    hasGuide: true,
  },
  {
    key: "pattaya",
    match: /pattaya|wongamat|jomtien|chonburi/i,
    searchQ: "Pattaya",
    img: "/experiences/regions/pattaya.jpg",
    areaKeys: ["pattaya"],
    hasGuide: true,
  },
  {
    key: "bangkok",
    match: /bangkok|krung ?thep/i,
    searchQ: "Bangkok",
    img: "/experiences/regions/bangkok.jpg",
    areaKeys: [],
    hasGuide: true,
  },
  {
    key: "samui",
    match: /samui/i,
    searchQ: "Koh Samui",
    img: "/experiences/regions/samui.jpg",
    areaKeys: [],
    hasGuide: false,
  },
  {
    key: "huahin",
    match: /hua ?hin/i,
    searchQ: "Hua Hin",
    img: "/experiences/regions/huahin.jpg",
    areaKeys: [],
    hasGuide: false,
  },
  {
    key: "chiangmai",
    match: /chiang ?mai/i,
    searchQ: "Chiang Mai",
    img: "/experiences/regions/chiangmai.jpg",
    areaKeys: [],
    hasGuide: false,
  },
] as const;

export type DestinationRegion = (typeof DESTINATION_REGIONS)[number];
export type DestinationRegionKey = DestinationRegion["key"];

export function destinationRegion(
  key: string,
): DestinationRegion | undefined {
  return DESTINATION_REGIONS.find((r) => r.key === key);
}
