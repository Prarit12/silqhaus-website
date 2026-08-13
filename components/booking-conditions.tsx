"use client";

import {
  CalendarCheck,
  CalendarClock,
  Check,
  CigaretteOff,
  PartyPopper,
  PawPrint,
  Percent,
  Tag,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

/**
 * "Booking conditions" — cancellation policy + house rules, rendered between
 * About and Amenities on the property detail page.
 *
 * Data honesty: check-in/out times and guest caps come from the PMS.
 * Pets reflect the listing's "Pets allowed" amenity. Smoking and parties
 * are the Silqhaus house defaults (no smoking indoors; events on request),
 * matching the villa rental terms. Policy copy is keyed by the PMS's policy
 * slug; unknown slugs render no cancellation card rather than a wrong claim.
 */

const KNOWN_POLICIES = new Set([
  "standard",
  "flexible",
  "moderate",
  "firm",
  "strict",
]);

/** Each policy as scannable refund tiers instead of a paragraph. Rows mirror
 *  the House-rules grammar: bold outcome left, condition right. */
type TierKind = "full" | "half" | "none";
const POLICY_TIERS: Record<string, Array<{ kind: TierKind; cond: string }>> = {
  flexible: [
    { kind: "full", cond: "flexibleFull" },
    { kind: "none", cond: "flexibleNone" },
  ],
  moderate: [
    { kind: "full", cond: "moderateFull" },
    { kind: "none", cond: "moderateNone" },
  ],
  firm: [
    { kind: "full", cond: "firmFull" },
    { kind: "half", cond: "firmHalf" },
    { kind: "none", cond: "firmNone" },
  ],
  strict: [
    { kind: "half", cond: "strictHalf" },
    { kind: "none", cond: "strictNone" },
  ],
};

/** The standard policy's full-refund deadline depends on stay length, so its
 *  tier row adapts: the applicable deadline once nights are known, a combined
 *  one-liner before dates are picked. Never two "Full refund" rows. */
function tiersFor(
  policy: string,
  nights: number | null,
): Array<{ kind: TierKind; cond: string }> {
  if (policy !== "standard") return POLICY_TIERS[policy] ?? [];
  const fullCond =
    nights == null
      ? "standardCombined"
      : nights >= 30
        ? "standardLong"
        : "standardShort";
  return [
    { kind: "full", cond: fullCond },
    { kind: "none", cond: "standardNone" },
  ];
}

const TIER_ICON: Record<TierKind, React.ReactNode> = {
  full: (
    <Check
      className="w-4 h-4 text-neutral-700 shrink-0"
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  half: (
    <Percent
      className="w-4 h-4 text-neutral-700 shrink-0"
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  none: (
    <X
      className="w-4 h-4 text-neutral-400 shrink-0"
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
};

interface BookingConditionsProps {
  /** "15:00" (Guesty) or "15" (Hostaway hour). */
  checkInTime?: string | null;
  checkOutTime?: string | null;
  maxGuests?: number | null;
  petsAllowed: boolean;
  /** Hostaway slug (flexible/moderate/firm/strict) or "standard" (Guesty). */
  cancellationPolicy?: string | null;
  /** Selected stay dates ("YYYY-MM-DD") — turn the timeline into real dates. */
  checkInDate?: string;
  checkOutDate?: string;
}

/** Days before check-in that a full refund is still available. The standard
 *  (Guesty) policy widens from 5 to 15 days for month-plus stays. */
function fullRefundLeadDays(policy: string, nights: number | null): number {
  switch (policy) {
    case "flexible":
      return 1;
    case "moderate":
      return 5;
    case "firm":
      return 30;
    case "strict":
      return 14;
    case "standard":
    default:
      return nights != null && nights >= 30 ? 15 : 5;
  }
}

function parseLocalDate(dateString: string | undefined): Date | null {
  if (!dateString) return null;
  const m = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function formatShortDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(raw: string | null | undefined, locale: string): string | null {
  if (raw == null || raw === "") return null;
  const m = String(raw).match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return String(raw);
  const hour = Number(m[1]);
  const minute = m[2] ?? "00";
  if (hour < 0 || hour > 23) return null;
  if (locale === "th") {
    return `${String(hour).padStart(2, "0")}:${minute} น.`;
  }
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute} ${period}`;
}

export function BookingConditions({
  checkInTime,
  checkOutTime,
  maxGuests,
  petsAllowed,
  cancellationPolicy,
  checkInDate,
  checkOutDate,
}: BookingConditionsProps) {
  const t = useTranslations("propertyDetail.bookingConditions");
  const locale = useLocale();

  const policy =
    cancellationPolicy && KNOWN_POLICIES.has(cancellationPolicy)
      ? cancellationPolicy
      : null;

  const checkIn = formatTime(checkInTime, locale);
  const checkOut = formatTime(checkOutTime, locale);

  // With real stay dates the timeline stops being a schematic: compute the
  // last day the policy still gives a full refund, and place the boundary
  // proportionally between today and check-in.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stayStart = parseLocalDate(checkInDate);
  const stayEnd = parseLocalDate(checkOutDate);
  const nights =
    stayStart && stayEnd
      ? Math.round((stayEnd.getTime() - stayStart.getTime()) / 86_400_000)
      : null;

  let deadline: Date | null = null;
  let fraction = 0.6;
  let windowOpen = false;
  const hasDates = !!stayStart && stayStart.getTime() > today.getTime();
  if (policy && hasDates && stayStart) {
    const lead = fullRefundLeadDays(policy, nights);
    deadline = new Date(stayStart);
    deadline.setDate(deadline.getDate() - lead);
    const total = stayStart.getTime() - today.getTime();
    fraction = Math.min(
      1,
      Math.max(0, (deadline.getTime() - today.getTime()) / total),
    );
    windowOpen = deadline.getTime() >= today.getTime();
  }

  const rules: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    value: string;
  }> = [];
  const iconCls = "w-[18px] h-[18px] text-neutral-700 shrink-0";
  if (checkIn) {
    rules.push({
      key: "checkIn",
      icon: <CalendarClock className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
      label: t("checkIn"),
      value: t("fromTime", { time: checkIn }),
    });
  }
  if (checkOut) {
    rules.push({
      key: "checkOut",
      icon: <CalendarCheck className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
      label: t("checkOut"),
      value: t("byTime", { time: checkOut }),
    });
  }
  if (maxGuests && maxGuests > 0) {
    rules.push({
      key: "guests",
      icon: <Users className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
      label: t("guests"),
      value: t("guestsMax", { count: maxGuests }),
    });
  }
  rules.push({
    key: "utilities",
    icon: <Zap className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
    label: t("utilities"),
    value: t("allInclusive"),
  });
  rules.push({
    key: "pets",
    icon: <PawPrint className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
    label: t("pets"),
    value: petsAllowed ? t("allowed") : t("notAllowed"),
  });
  rules.push({
    key: "parties",
    icon: <PartyPopper className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
    label: t("partiesEvents"),
    value: t("onRequest"),
  });
  rules.push({
    key: "smoking",
    icon: <CigaretteOff className={iconCls} strokeWidth={1.5} aria-hidden="true" />,
    label: t("smoking"),
    value: t("notAllowed"),
  });

  return (
    <section className="py-8 border-b border-neutral-200">
      <h2 className="text-xl font-semibold normal-case tracking-normal text-ink mb-5">
        {t("title")}
      </h2>
      {/* No items-start: both cards stretch to the taller one's height. */}
      <div className={`grid gap-4 ${policy ? "md:grid-cols-2" : ""}`}>
        {policy && (
          <div className="rounded-2xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-ink">
                {t("cancellationTitle")}
              </h3>
              <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-ink">
                {t("policyLabel", { name: t(`policyName.${policy}`) })}
              </span>
            </div>

            <ul className="mt-1.5">
              {tiersFor(policy, nights).map((tier, i) => (
                <li
                  key={tier.cond}
                  className={`flex items-start justify-between gap-4 py-2.5 ${
                    i > 0 ? "border-t border-neutral-100" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-[13px] font-semibold text-ink shrink-0">
                    {TIER_ICON[tier.kind]}
                    {t(`tier.${tier.kind}`)}
                  </span>
                  <span className="text-[13px] text-neutral-600 text-right leading-snug">
                    {t(`cond.${tier.cond}`)}
                  </span>
                </li>
              ))}
              {/* Non-refundable rate option, same row grammar */}
              <li className="flex items-start justify-between gap-4 py-2.5 border-t border-neutral-100">
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-ink shrink-0">
                  <Tag
                    className="w-4 h-4 text-neutral-700 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {t("nonRefundableTitle")}
                </span>
                <span className="text-[13px] text-neutral-600 text-right leading-snug">
                  {t("nonRefundableShort")}
                </span>
              </li>
            </ul>

            {deadline && stayStart ? (
              /* Real dates: today → free-cancellation deadline → check-in */
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-medium text-ink mb-1.5">
                  <span>{t("timelineToday")}</span>
                  <span>
                    {t("timelineCheckInDate", {
                      date: formatShortDate(stayStart, locale),
                    })}
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-neutral-200">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-ink transition-all duration-300"
                    style={{ width: `${Math.round(fraction * 100)}%` }}
                  />
                  {windowOpen && (
                    <span
                      className="absolute -top-1 h-4 w-0.5 rounded-full bg-ink"
                      style={{ left: `${Math.round(fraction * 100)}%` }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p
                  className={`mt-2 text-xs font-medium ${
                    windowOpen ? "text-ink" : "text-neutral-600"
                  }`}
                  style={
                    windowOpen
                      ? {
                          textAlign:
                            fraction < 0.25
                              ? "left"
                              : fraction > 0.75
                                ? "right"
                                : "center",
                        }
                      : undefined
                  }
                >
                  {windowOpen
                    ? t("freeCancellationUntil", {
                        date: formatShortDate(deadline, locale),
                      })
                    : t("noFreeCancellation")}
                </p>
              </div>
            ) : (
              /* No dates yet: schematic bar + nudge to pick dates */
              <div className="mt-4">
                <div
                  className="flex justify-between text-[11px] font-medium text-ink mb-1.5"
                  aria-hidden="true"
                >
                  <span>↓ {t("timelineBooking")}</span>
                  <span>↓ {t("timelineWindow")}</span>
                  <span>{t("timelineCheckIn")} ↓</span>
                </div>
                <div
                  className="h-2 rounded-full bg-neutral-200 overflow-hidden"
                  aria-hidden="true"
                >
                  <div className="h-full w-3/5 rounded-full bg-ink" />
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  {t("selectDatesHint")}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-neutral-200 p-5">
          <h3 className="text-base font-semibold text-ink">
            {t("rulesTitle")}
          </h3>
          <ul className="mt-2">
            {rules.map((rule, i) => (
              <li
                key={rule.key}
                className={`flex items-center justify-between gap-4 py-2.5 ${
                  i > 0 ? "border-t border-neutral-100" : ""
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  {rule.icon}
                  {rule.label}
                </span>
                <span className="text-sm text-neutral-600 text-right">
                  {rule.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
