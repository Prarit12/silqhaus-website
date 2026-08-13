"use client";

/**
 * Hero illustration for the monthly-stays page: a pool villa under palms
 * in the same hand-drawn language as the journey cartoons — ink strokes,
 * brand-orange accents, soft neutral blobs. Pure inline SVG, no assets.
 */

const INK = "#171717";
const ORANGE = "#F38338";
const ORANGE_DEEP = "#C46A33";
const BLOB = "#ECEAE4";

const stroke = {
  stroke: INK,
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function MonthlyHeroArt() {
  return (
    <svg viewBox="0 0 380 250" className="w-full h-auto" aria-hidden="true">
      {/* ground + ambient blobs */}
      <ellipse cx="195" cy="216" rx="158" ry="22" fill={BLOB} />
      <circle cx="58" cy="66" r="20" fill={BLOB} />
      <circle cx="338" cy="96" r="24" fill={BLOB} />

      {/* sun */}
      <circle cx="322" cy="44" r="15" fill={ORANGE} />
      <path
        d="M322 20v-7M340 26l5-5M346 44h7M304 26l-5-5"
        stroke={ORANGE_DEEP}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* birds */}
      <path {...stroke} strokeWidth={2.2} d="M84 40c4-4 8-4 12 0c4-4 8-4 12 0" />
      <path {...stroke} strokeWidth={2.2} d="M116 26c3-3 6-3 9 0c3-3 6-3 9 0" />

      {/* palm tree */}
      <path {...stroke} d="M64 200c-3-32 3-58 15-76" />
      <path {...stroke} d="M79 124c-14-8-28-8-40 0c14-12 30-15 40-8" />
      <path {...stroke} d="M79 124c-2-14 3-26 14-34c-8 12-10 24-6 32" />
      <path {...stroke} d="M79 124c10-10 24-13 36-8c-14 0-26 5-32 14" />
      <circle cx="76" cy="130" r="3.4" fill={ORANGE} />
      <circle cx="86" cy="134" r="3.4" fill={ORANGE_DEEP} />

      {/* villa — two flat-roof volumes */}
      <path {...stroke} d="M136 198v-66h96v66" fill="#fff" />
      <path {...stroke} d="M232 198v-92h72v92" fill="#fff" />
      <path {...stroke} d="M128 132h112M224 106h88" />
      {/* picture window with mullions */}
      <rect x="152" y="146" width="42" height="36" rx="3" {...stroke} />
      <path {...stroke} strokeWidth={2.2} d="M173 146v36M152 164h42" />
      {/* door */}
      <path
        d="M206 198v-38c0-3 2-5 5-5h12c3 0 5 2 5 5v38Z"
        fill={ORANGE}
      />
      <circle cx="222" cy="180" r="1.8" fill="#fff" />
      {/* upper windows */}
      <rect x="246" y="122" width="20" height="20" rx="3" {...stroke} />
      <rect x="278" y="122" width="20" height="20" rx="3" {...stroke} />
      <path {...stroke} strokeWidth={2.2} d="M246 158h52" />

      {/* hanging ฿/mo price tag off the eave */}
      <path {...stroke} d="M304 106c8 5 11 11 11 19" />
      <g transform="rotate(-12 330 140)">
        <rect x="298" y="126" width="52" height="27" rx="8" fill={ORANGE} />
        <circle cx="307" cy="139.5" r="2.8" fill="#fff" />
        <text
          x="330"
          y="146"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#fff"
        >
          ฿/mo
        </text>
      </g>

      {/* pool with a ladder and lazy waves */}
      <rect x="142" y="206" width="132" height="26" rx="13" {...stroke} fill="#fff" />
      <path
        d="M158 219c6-5 12-5 18 0s12 5 18 0s12-5 18 0s12 5 18 0"
        stroke={ORANGE}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <path {...stroke} strokeWidth={2.2} d="M262 200v22M270 200v22M262 206h8M262 214h8" />

      {/* sparkles */}
      <path d="M106 58l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill={ORANGE} />
      <path d="M356 176l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill={ORANGE_DEEP} />
      <path {...stroke} strokeWidth={2.2} d="M132 84l2 5M142 80l1 5" />
    </svg>
  );
}
