import { Star } from "lucide-react";

/**
 * Five stars; `value` (out of 5) fills them in white — fractions render
 * as a partially filled star, the remainder stays dark.
 */
export default function StarRow({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  const stars = (
    <span className="flex w-max items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </span>
  );
  return (
    <span
      className="relative inline-block"
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      <span className="text-white/15">{stars}</span>
      <span
        className="absolute inset-0 overflow-hidden text-white"
        style={{ width: `${(clamped / 5) * 100}%` }}
        aria-hidden="true"
      >
        {stars}
      </span>
    </span>
  );
}
