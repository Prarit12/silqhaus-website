"use client";

import {
  CalendarCheck,
  CalendarClock,
  CigaretteOff,
  PartyPopper,
  PawPrint,
  Users,
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

interface BookingConditionsProps {
  /** "15:00" (Guesty) or "15" (Hostaway hour). */
  checkInTime?: string | null;
  checkOutTime?: string | null;
  maxGuests?: number | null;
  petsAllowed: boolean;
  /** Hostaway slug (flexible/moderate/firm/strict) or "standard" (Guesty). */
  cancellationPolicy?: string | null;
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
}: BookingConditionsProps) {
  const t = useTranslations("propertyDetail.bookingConditions");
  const locale = useLocale();

  const policy =
    cancellationPolicy && KNOWN_POLICIES.has(cancellationPolicy)
      ? cancellationPolicy
      : null;

  const checkIn = formatTime(checkInTime, locale);
  const checkOut = formatTime(checkOutTime, locale);

  const rules: Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    value: string;
  }> = [];
  const iconCls = "w-5 h-5 text-neutral-700 shrink-0";
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
      <div
        className={`grid gap-4 ${policy ? "md:grid-cols-2" : ""} items-start`}
      >
        {policy && (
          <div className="rounded-2xl border border-neutral-200 p-5 sm:p-6">
            <h3 className="text-[17px] font-semibold text-ink">
              {t("cancellationTitle")}
            </h3>
            <p className="mt-3 text-[15px] font-semibold text-ink">
              {t("policyLabel", { name: t(`policyName.${policy}`) })}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
              {t(`policyBody.${policy}`)}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{t("comfortNote")}</p>

            {/* Booking → cancellation window → check-in */}
            <div className="mt-6" aria-hidden="true">
              <div className="flex justify-between text-xs font-medium text-ink mb-2">
                <span>↓ {t("timelineBooking")}</span>
                <span>↓ {t("timelineWindow")}</span>
                <span>{t("timelineCheckIn")} ↓</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div className="h-full w-3/5 rounded-full bg-ink" />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-neutral-200 p-5 sm:p-6">
          <h3 className="text-[17px] font-semibold text-ink">
            {t("rulesTitle")}
          </h3>
          <ul className="mt-2">
            {rules.map((rule, i) => (
              <li
                key={rule.key}
                className={`flex items-center justify-between gap-4 py-3 ${
                  i > 0 ? "border-t border-neutral-100" : ""
                }`}
              >
                <span className="flex items-center gap-3 text-[15px] font-medium text-ink">
                  {rule.icon}
                  {rule.label}
                </span>
                <span className="text-[15px] text-neutral-600 text-right">
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
