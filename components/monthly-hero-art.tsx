"use client";

/**
 * Hero illustration for the monthly-stays page: a panoramic pool-villa
 * scene — palm, villa with a hanging ฿/mo tag, pool, neighbour house and
 * sun — in the same hand-drawn language as the benefit scenes below it.
 * Pure inline SVG, no assets.
 */

const INK = "#171717";
const ORANGE = "#F38338";
const ORANGE_DEEP = "#C46A33";
const BLOB = "#ECEAE4";

const stroke = {
  stroke: INK,
  strokeWidth: 3.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function MonthlyHeroArt() {
  return (
    <svg viewBox="0 0 760 260" className="w-full h-auto" aria-hidden="true">
      {/* ground + ambient blobs */}
      <ellipse cx="380" cy="234" rx="310" ry="16" fill={BLOB} />
      <circle cx="86" cy="84" r="22" fill={BLOB} />
      <circle cx="672" cy="118" r="24" fill={BLOB} />
      <circle cx="300" cy="46" r="16" fill={BLOB} />

      {/* sun */}
      <circle cx="648" cy="48" r="15" fill={ORANGE} />
      <path
        d="M648 24v-7M666 30l5-5M672 48h7M630 30l-5-5"
        stroke={ORANGE_DEEP}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* birds */}
      <path {...stroke} strokeWidth={2.4} d="M232 52c4-4 8-4 12 0c4-4 8-4 12 0" />
      <path {...stroke} strokeWidth={2.4} d="M280 34c3-3 6-3 9 0c3-3 6-3 9 0" />

      {/* palm */}
      <path {...stroke} d="M118 218c-4-34 3-62 16-82" />
      <path {...stroke} d="M134 136c-15-9-30-9-43 0c15-13 32-16 43-9" />
      <path {...stroke} d="M134 136c-2-15 3-28 15-37c-9 13-11 26-6 35" />
      <path {...stroke} d="M134 136c11-11 26-14 39-9c-15 0-28 5-34 15" />
      <circle cx="131" cy="143" r="3.6" fill={ORANGE} />
      <circle cx="142" cy="147" r="3.6" fill={ORANGE_DEEP} />

      {/* villa — two flat-roof volumes */}
      <path {...stroke} d="M300 214v-72h104v72" fill="#fff" />
      <path {...stroke} d="M404 214V114h78v100" fill="#fff" />
      <path {...stroke} d="M292 142h120M396 114h94" />
      <path {...stroke} d="M284 214h206" />
      {/* picture window with mullions */}
      <rect x="318" y="158" width="46" height="38" rx="3" {...stroke} />
      <path {...stroke} strokeWidth={2.6} d="M341 158v38M318 177h46" />
      {/* door */}
      <path
        d="M376 214v-42c0-3 2-5 5-5h14c3 0 5 2 5 5v42Z"
        fill={ORANGE}
      />
      <circle cx="394" cy="192" r="2" fill="#fff" />
      {/* upper windows */}
      <rect x="420" y="132" width="22" height="22" rx="3" {...stroke} />
      <rect x="454" y="132" width="22" height="22" rx="3" {...stroke} />
      <path {...stroke} strokeWidth={2.6} d="M420 170h58" />

      {/* hanging ฿/mo price tag off the eave */}
      <path {...stroke} d="M482 114c9 5 13 11 14 19" />
      <g transform="rotate(-12 514 150)">
        <rect x="486" y="136" width="58" height="28" rx="8" fill={ORANGE} />
        <circle cx="496" cy="150" r="2.9" fill="#fff" />
        <text
          x="519"
          y="156.5"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#fff"
        >
          ฿/mo
        </text>
      </g>

      {/* pool with a ladder and lazy waves */}
      <rect x="310" y="222" width="150" height="26" rx="13" {...stroke} fill="#fff" />
      <path
        d="M330 235c6-5 13-5 19 0s13 5 19 0s13-5 19 0s13 5 19 0s13-5 19 0"
        stroke={ORANGE}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path {...stroke} strokeWidth={2.6} d="M446 216v24M454 216v24M446 222h8M446 230h8" />

      {/* neighbour house */}
      <path {...stroke} d="M596 212v-42l30-24 30 24v42" fill="#fff" />
      <path {...stroke} d="M588 212h76" />
      <rect x="610" y="180" width="15" height="13" rx="2" {...stroke} />
      <path
        d="M638 212v-20c0-2 1.6-3.5 3.6-3.5h9c2 0 3.6 1.5 3.6 3.5v20Z"
        fill={ORANGE_DEEP}
      />

      {/* sparkles */}
      <path d="M214 96l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill={ORANGE} />
      <path d="M556 84l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill={ORANGE_DEEP} />
      <path {...stroke} strokeWidth={2.4} d="M352 66l2 5M362 60l1 5" />
      <path {...stroke} strokeWidth={2.4} d="M700 180l2 5M708 174l1 5" />
    </svg>
  );
}
