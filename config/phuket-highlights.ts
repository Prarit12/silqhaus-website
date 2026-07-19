/**
 * Phuket highlight data carried over from the legacy /destination/phuket
 * page: real beach photography, and the blog guides each spot links to.
 * Names/descriptions come from the `destination.phuket.attractions.*`
 * i18n keys so existing translations keep working.
 */
export const PHUKET_BEACHES = [
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
] as const;

/** Blog guides backing specific spots inside the six category sections. */
export const PHUKET_SPOT_GUIDES: Record<string, Record<string, string>> = {
  culture: { s1: "/guides/phuket-old-town-things-to-do" },
  temples: {
    s1: "/guides/wat-chalong-guide",
    s2: "/guides/big-buddha-phuket-guide",
  },
};
