import { Star } from "lucide-react";
import {
  AirbnbLockup,
  BookingLockup,
  ExpediaLockup,
  AgodaLockup,
  VrboLockup,
  TripLockup,
} from "@/components/logos/ota-logos";

/** Guest ratings per platform, normalized to a 5-star scale. */
const PLATFORM_RATINGS = [
  { key: "airbnb", logo: AirbnbLockup, stars: 4.99 },
  { key: "booking", logo: BookingLockup, stars: 4.9 },
  { key: "expedia", logo: ExpediaLockup, stars: 4.9 },
  { key: "agoda", logo: AgodaLockup, stars: 4.85 },
  { key: "vrbo", logo: VrboLockup, stars: 5.0 },
  { key: "trip", logo: TripLockup, stars: 4.9 },
] as const;

/** Five stars; the rating fills them in white, the remainder stays dark. */
function StarRow({ value }: { value: number }) {
  const stars = (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-4 h-4" fill="currentColor" stroke="none" />
      ))}
    </span>
  );
  return (
    <span
      className="relative inline-block"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      <span className="text-white/15">{stars}</span>
      <span
        className="absolute inset-0 overflow-hidden text-white"
        style={{ width: `${(value / 5) * 100}%` }}
        aria-hidden="true"
      >
        {stars}
      </span>
    </span>
  );
}

/** White OTA lockups with five-star ratings — shared trust strip. */
export default function OtaRatingsRow() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 sm:gap-x-14 lg:gap-x-16">
      {PLATFORM_RATINGS.map((p) => (
        <div key={p.key} className="flex flex-col items-center gap-3">
          <span className="text-white/80">
            <p.logo />
          </span>
          <StarRow value={p.stars} />
        </div>
      ))}
    </div>
  );
}
