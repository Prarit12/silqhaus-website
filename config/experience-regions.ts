/**
 * The six most-visited regions on the Experiences surface, and the six
 * experience lenses every region guide shares. Region guides ship
 * incrementally — `hasGuide` gates which cards link out.
 */
export const EXPERIENCE_CATEGORIES = [
  "culture",
  "temples",
  "islands",
  "wellness",
  "photo",
  "festivals",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export const EXPERIENCE_REGIONS = [
  { key: "bangkok", img: "/experiences/regions/bangkok.jpg", hasGuide: true },
  { key: "phuket", img: "/experiences/regions/phuket.jpg", hasGuide: true },
  { key: "chiangmai", img: "/experiences/regions/chiangmai.jpg", hasGuide: false },
  { key: "samui", img: "/experiences/regions/samui.jpg", hasGuide: false },
  { key: "pattaya", img: "/experiences/regions/pattaya.jpg", hasGuide: true },
  { key: "huahin", img: "/experiences/regions/huahin.jpg", hasGuide: false },
] as const;

export type ExperienceRegionKey = (typeof EXPERIENCE_REGIONS)[number]["key"];
