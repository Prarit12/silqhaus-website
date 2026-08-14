import { Star } from "lucide-react";
import {
  AirbnbLockup,
  BookingLockup,
  ExpediaLockup,
  AgodaLockup,
  VrboLockup,
  TripLockup,
} from "@/components/logos/ota-logos";

/** Guest ratings per platform, each on its native scale. */
const PLATFORM_RATINGS = [
  { key: "airbnb", logo: AirbnbLockup, rating: "4.99", scale: "/5" },
  { key: "booking", logo: BookingLockup, rating: "9.8", scale: "/10" },
  { key: "expedia", logo: ExpediaLockup, rating: "9.8", scale: "/10" },
  { key: "agoda", logo: AgodaLockup, rating: "9.7", scale: "/10" },
  { key: "vrbo", logo: VrboLockup, rating: "5.0", scale: "/5" },
  { key: "trip", logo: TripLockup, rating: "9.8", scale: "/10" },
] as const;

/** White OTA lockups with their star ratings — shared trust strip. */
export default function OtaRatingsRow() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 sm:gap-x-14 lg:gap-x-16">
      {PLATFORM_RATINGS.map((p) => (
        <div key={p.key} className="flex flex-col items-center gap-3">
          <span className="text-white/80">
            <p.logo />
          </span>
          <span className="inline-flex items-baseline gap-1 text-white">
            <Star
              className="w-3.5 h-3.5 self-center fill-white text-white"
              aria-hidden="true"
            />
            <span className="font-semibold text-lg leading-none">
              {p.rating}
            </span>
            <span className="text-white/45 text-xs">{p.scale}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
