"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import emailjs from "@emailjs/browser";
import {
  ArrowDown,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Star,
} from "lucide-react";
import { SiLine, SiWhatsapp } from "react-icons/si";
import { useTranslations, useLocale } from "next-intl";
import {
  COUNTRY_CODES,
  getCodeFromValue,
  DEFAULT_COUNTRY_VALUE,
} from "@/lib/country-codes";
import { MonthlyJourney } from "@/components/monthly-journey";
import { MonthlyHeroArt } from "@/components/monthly-hero-art";
import { SingleDatePicker } from "@/components/single-date-picker";
import { displayPropertyName } from "@/config/property-names";
import { monthlyDiscountFor } from "@/config/monthly";
import { getSilqhausMarkupPercentage } from "@/config/ota-markups";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_SDR || "";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LONGTERMSTAY || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SDR || "";
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@silqhaus.com";
const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "";
const CONTACT_LINE = process.env.NEXT_PUBLIC_CONTACT_LINE || "";
const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const CONTACT_PHONE_TEL = process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL || "";

interface MonthlyListing {
  id: number | string;
  source: "hostaway" | "guesty";
  name: string;
  nickname?: string;
  city?: string;
  state?: string;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  personCapacity?: number;
  averageReviewRating?: number;
  listingImages?: Array<{ url: string }>;
  /** Hostaway pay-fraction monthly factor (0.8 = 20% off). */
  monthlyDiscount?: number | null;
  /** Guesty pay-fraction monthly factor. */
  monthlyPriceFactor?: number | null;
}

interface CalendarDay {
  date: string;
  price: number;
  isAvailable: number;
  status: string;
}

const MONTH_OPTIONS = [1, 2, 3, 6, 12] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addMonthsClamped(dateString: string, months: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(d, lastDay));
  return toDateString(target);
}

function nightsBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) /
      86_400_000,
  );
}

function addDaysStr(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  return toDateString(new Date(y, m - 1, d + days));
}

function formatDateForDisplay(dateStr: string) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

const inputCls =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-500 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink";

function MonthlyStays() {
  const t = useTranslations("monthlyInquiry");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pidParam = searchParams.get("pid") || "";
  const legacyName = searchParams.get("property") || "";
  const checkInParam = searchParams.get("checkIn") || "";

  // ------------------------------------------------------------------
  // Inventory
  // ------------------------------------------------------------------
  const hostawayQuery = useQuery<any[]>({
    queryKey: ["hostaway", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/hostaway/listings");
      if (!res.ok) throw new Error("Failed to fetch hostaway listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
  const guestyQuery = useQuery<any[]>({
    queryKey: ["guesty", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/guesty/listings");
      if (!res.ok) throw new Error("Failed to fetch guesty listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const listings: MonthlyListing[] = useMemo(() => {
    const ha = (hostawayQuery.data ?? []).map((l: any) => ({
      ...l,
      source: (l.source ?? "hostaway") as MonthlyListing["source"],
    }));
    const gu = (guestyQuery.data ?? []).map((l: any) => ({
      ...l,
      source: (l.source ?? "guesty") as MonthlyListing["source"],
    }));
    return [...ha, ...gu];
  }, [hostawayQuery.data, guestyQuery.data]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Resolve the arriving property once inventory is in: pid first, then the
  // legacy ?property= name.
  useEffect(() => {
    if (selectedKey || listings.length === 0) return;
    if (pidParam) {
      const hit = listings.find((l) => `${l.source}:${l.id}` === pidParam);
      if (hit) {
        setSelectedKey(pidParam);
        setStep(2);
        return;
      }
    }
    if (legacyName) {
      const hit = listings.find(
        (l) =>
          l.name === legacyName || displayPropertyName(l) === legacyName,
      );
      if (hit) setSelectedKey(`${hit.source}:${hit.id}`);
    }
  }, [listings, pidParam, legacyName, selectedKey]);

  const selected =
    listings.find((l) => `${l.source}:${l.id}` === selectedKey) ?? null;
  const selectedTitle = selected ? displayPropertyName(selected) : "";

  // ------------------------------------------------------------------
  // Calendar for the selected property
  // ------------------------------------------------------------------
  const calendarQuery = useQuery<CalendarDay[]>({
    queryKey: ["monthly-calendar", selectedKey],
    enabled: !!selected,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!selected) return [];
      if (selected.source === "guesty") {
        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + 6);
        const res = await fetch(
          `/api/guesty/calendar/${encodeURIComponent(String(selected.id))}?startDate=${toDateString(start)}&endDate=${toDateString(end)}`,
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.days || []).map((d: any) => ({
          date: d.date,
          price: d.price || 0,
          isAvailable: d.isBlocked ? 0 : 1,
          status: d.isBlocked ? "reserved" : "available",
        }));
      }
      const res = await fetch(
        `/api/hostaway/availability?listingId=${selected.id}`,
      );
      if (!res.ok) return [];
      const data = await res.json();
      return data.calendar || [];
    },
  });

  // ------------------------------------------------------------------
  // Quote inputs
  // ------------------------------------------------------------------
  const today = toDateString(new Date());
  const defaultMoveIn =
    checkInParam && checkInParam > today ? checkInParam : addDaysStr(today, 14);
  const [moveIn, setMoveIn] = useState(defaultMoveIn);
  const [months, setMonths] = useState<number | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const hasTerm = months != null || !!customEnd;

  const moveOut = useMemo(
    () =>
      customEnd || (moveIn && months ? addMonthsClamped(moveIn, months) : ""),
    [moveIn, months, customEnd],
  );

  const quote = useMemo(() => {
    if (!selected || !moveIn || !moveOut) return null;
    const nights = nightsBetween(moveIn, moveOut);
    if (nights <= 0) return null;

    const byDate = new Map<string, CalendarDay>();
    for (const day of calendarQuery.data ?? []) byDate.set(day.date, day);

    const markup = getSilqhausMarkupPercentage(selected.source) / 100;
    let sum = 0;
    let priced = 0;
    let conflicts = 0;
    for (let d = moveIn; d < moveOut; d = addDaysStr(d, 1)) {
      const day = byDate.get(d);
      if (!day) continue;
      if (day.isAvailable !== 1 || day.status === "reserved") conflicts++;
      if (day.price > 0) {
        sum += Math.ceil(day.price * (1 + markup));
        priced++;
      }
    }
    if (priced === 0) return null;
    const avg = sum / priced;
    const missing = nights - priced;
    const nightlyTotal = Math.round(sum + avg * missing);

    const discount = monthlyDiscountFor({
      id: selected.id,
      source: selected.source,
      monthlyFactor:
        selected.source === "hostaway"
          ? selected.monthlyDiscount
          : selected.monthlyPriceFactor,
    });
    const monthlyTotal = Math.round(nightlyTotal * (1 - discount));
    return {
      nights,
      nightlyTotal,
      discount,
      monthlyTotal,
      perMonth: Math.round(monthlyTotal / (months ?? Math.max(1, nights / 30.44))),
      savings: nightlyTotal - monthlyTotal,
      estimated: missing > 0,
      conflicts,
    };
  }, [selected, moveIn, moveOut, months, calendarQuery.data]);

  const fmt = (n: number) => `฿${n.toLocaleString()}`;

  // The message that travels to the form, WhatsApp and LINE.
  const quoteMessage = useMemo(() => {
    if (!selected || !quote) return "";
    return months != null
      ? t("quote.chatMessage", {
          property: selectedTitle,
          moveIn: formatDateForDisplay(moveIn),
          months,
          rate: fmt(quote.perMonth),
        })
      : t("quote.chatMessageDates", {
          property: selectedTitle,
          moveIn: formatDateForDisplay(moveIn),
          moveOut: formatDateForDisplay(moveOut),
          rate: fmt(quote.perMonth),
        });
  }, [selected, quote, selectedTitle, moveIn, moveOut, months, t]);

  const whatsappHref = CONTACT_WHATSAPP
    ? `https://wa.me/${CONTACT_WHATSAPP.replace(/[^0-9]/g, "")}${
        quoteMessage ? `?text=${encodeURIComponent(quoteMessage)}` : ""
      }`
    : null;
  const lineHref = CONTACT_LINE
    ? `https://line.me/R/oaMessage/${encodeURIComponent(CONTACT_LINE)}/${
        quoteMessage ? `?${encodeURIComponent(quoteMessage)}` : ""
      }`
    : null;

  // ------------------------------------------------------------------
  // Inquiry form (EmailJS — unchanged mechanism)
  // ------------------------------------------------------------------
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: DEFAULT_COUNTRY_VALUE,
    phone: "",
    tenants: "",
    message: "",
  });
  const [panelTab, setPanelTab] = useState<"details" | "viewing">("details");
  const [viewDate, setViewDate] = useState<string | null>(null);
  const [viewOffset, setViewOffset] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  // Days a guest can visit: future dates the live calendar marks free.
  const viewableDays = useMemo(() => {
    const cutoff = addDaysStr(today, 1);
    return (calendarQuery.data ?? [])
      .filter(
        (d) =>
          d.date >= cutoff && d.isAvailable === 1 && d.status !== "reserved",
      )
      .map((d) => d.date)
      .sort();
  }, [calendarQuery.data, today]);

  useEffect(() => {
    if (viewableDays.length === 0) {
      setViewDate(null);
      setViewOffset(0);
      return;
    }
    if (!viewDate || !viewableDays.includes(viewDate)) {
      setViewDate(viewableDays[0]);
      setViewOffset(0);
    }
  }, [viewableDays, viewDate]);

  useEffect(() => {
    if (submitStatus === "success" || submitStatus === "error") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 20000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) =>
    phone === "" || /^[0-9\s\-]{6,15}$/.test(phone);

  const scrollToForm = () => {
    setPanelTab("details");
    setForm((prev) => ({
      ...prev,
      message: prev.message || quoteMessage,
    }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scheduleViewing = () => {
    if (!viewDate) return;
    setPanelTab("details");
    setForm((prev) => ({
      ...prev,
      message: t("viewing.message", {
        property: selectedTitle,
        date: formatDateForDisplay(viewDate),
      }),
    }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!validateEmail(form.email))
      newErrors.email = t("validation.invalidEmail");
    if (!validatePhone(form.phone))
      newErrors.phone = t("validation.invalidPhone");
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const dialCode = getCodeFromValue(form.countryCode);
    const templateParams = {
      name: form.name,
      email: form.email,
      phone: form.phone ? `${dialCode} ${form.phone}` : t("notProvided"),
      tenants: form.tenants || t("notProvided"),
      move_in: moveIn ? formatDateForDisplay(moveIn) : t("notProvided"),
      move_out: moveOut ? formatDateForDisplay(moveOut) : t("notProvided"),
      property: selected
        ? `${selectedTitle} (${selected.source}:${selected.id})${
            quote ? ` — quoted ${fmt(quote.perMonth)}/mo` : ""
          }`
        : t("notProvided"),
      message: form.message || quoteMessage || t("notProvided"),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );
      setSubmitStatus("success");
      setForm({
        name: "",
        email: "",
        countryCode: DEFAULT_COUNTRY_VALUE,
        phone: "",
        tenants: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingInventory = hostawayQuery.isLoading || guestyQuery.isLoading;

  return (
    <main className="min-h-screen bg-white text-ink pt-14 md:pt-16">
      {/* Hero — its own warm band, clearly split from the booking flow */}
      <div className="bg-[#F5F4F0] border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:items-center">
            <div>
              <h1 className="text-[34px] leading-[1.1] md:text-5xl font-bold tracking-tight text-ink text-balance">
                {t("quote.pageTitle")}
              </h1>
              <p className="mt-4 text-[15px] md:text-base leading-relaxed text-neutral-600 max-w-[58ch]">
                {t("quote.pageSubtitle")}
              </p>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("monthly-booking");
                  const reduce = window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches;
                  el?.scrollIntoView({
                    behavior: reduce ? "auto" : "smooth",
                    block: "start",
                  });
                }}
                className="mt-7 inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
              >
                {t("quote.heroCta")}
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:block">
              <MonthlyHeroArt />
            </div>
          </div>

          {/* How it works — illustrated journey */}
          <MonthlyJourney />
        </div>
      </div>

      {/* Booking flow */}
      <div
        id="monthly-booking"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 scroll-mt-20"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-12 lg:items-start">
          <div className="min-w-0">
        {/* Step wizard */}
        <div>
          {/* Progress header */}
          <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Steps">
            {[1, 2, 3, 4].map((n) => {
              const complete =
                (n === 1 && !!selected) ||
                (n === 2 && !!moveIn && step > 2) ||
                (n === 3 && hasTerm);
              const reachable =
                n === 1 ||
                (n === 2 && !!selected) ||
                (n === 3 && !!selected && !!moveIn) ||
                (n === 4 && !!selected && !!moveIn && hasTerm);
              const active = step === n;
              return (
                <li
                  key={n}
                  className="flex items-center gap-1.5 sm:gap-2 flex-1 last:flex-none"
                >
                  <button
                    type="button"
                    onClick={() => reachable && setStep(n)}
                    disabled={!reachable}
                    aria-current={active ? "step" : undefined}
                    className="flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <span
                      className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold border transition-colors ${
                        active
                          ? "bg-ink text-white border-ink"
                          : complete
                            ? "bg-white text-ink border-ink"
                            : "bg-white text-neutral-400 border-neutral-200"
                      }`}
                    >
                      {complete && !active ? (
                        <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                      ) : (
                        n
                      )}
                    </span>
                    <span
                      className={`hidden md:block text-[13px] font-medium whitespace-nowrap ${
                        active
                          ? "text-ink"
                          : complete
                            ? "text-neutral-600"
                            : "text-neutral-400"
                      }`}
                    >
                      {t(`quote.step${n}Title`)}
                    </span>
                  </button>
                  {n < 4 && (
                    <span className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>

          {/* Step panel */}
          <div className="mt-4 rounded-2xl border border-neutral-200 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {t("quote.stepLabel", { n: step })}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold normal-case tracking-normal text-ink">
              {t(`quote.step${step}Title`)}
            </h2>

            {/* Step 1 — property */}
            {step === 1 && (
              <div className="mt-4">
                {isLoadingInventory ? (
                  <p className="text-sm text-neutral-600">
                    {t("quote.loadingProperties")}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listings.map((l) => {
                      const key = `${l.source}:${l.id}`;
                      const title = displayPropertyName(l);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedKey(key);
                            setStep(2);
                          }}
                          className={`text-left rounded-xl border p-2 transition-colors ${
                            key === selectedKey
                              ? "border-ink"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
                            {l.listingImages?.[0]?.url && (
                              <Image
                                src={l.listingImages[0].url}
                                alt={title}
                                fill
                                sizes="(max-width: 640px) 50vw, 200px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <p className="mt-1.5 text-[13px] font-semibold text-ink truncate">
                            {title}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {[l.city, l.state].filter(Boolean).join(", ")}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — property beside a big, unmissable date field */}
            {step === 2 && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-8 items-center">
                {selected && (
                  <div className="flex items-center gap-3 sm:pr-8 sm:border-r sm:border-neutral-100">
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                      {selected.listingImages?.[0]?.url && (
                        <Image
                          src={selected.listingImages[0].url}
                          alt={selectedTitle}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-ink truncate">
                        {selectedTitle}
                      </p>
                      <p className="text-[13px] text-neutral-500 truncate">
                        {[selected.city, selected.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                <div id="wizard-movein">
                  <span className="block text-xs font-bold uppercase tracking-wide mb-2 text-ink">
                    {t("form.labels.moveIn")}
                  </span>
                  <SingleDatePicker
                    value={moveIn}
                    onChange={setMoveIn}
                    calendarData={calendarQuery.data ?? []}
                    minDate={today}
                    disableReserved
                    markupSource={selected?.source ?? "hostaway"}
                    ariaLabel={t("form.labels.moveIn")}
                    size="xl"
                  />
                </div>
              </div>
            )}

            {/* Step 3 — length via pills, or an exact check-out date */}
            {step === 3 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {MONTH_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMonths(m);
                        setCustomEnd(null);
                        setStep(4);
                      }}
                      aria-pressed={months === m}
                      className={`h-12 w-full rounded-lg border text-sm font-semibold transition-colors ${
                        months === m
                          ? "bg-ink text-white border-ink"
                          : "bg-white text-ink border-neutral-300 hover:border-ink"
                      }`}
                    >
                      {t("quote.monthsShort", { count: m })}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1 bg-neutral-200" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {t("quote.orDivider")}
                  </span>
                  <span className="h-px flex-1 bg-neutral-200" />
                </div>

                <div id="wizard-moveout" className="mt-4">
                  <span className="block text-xs font-bold uppercase tracking-wide mb-2 text-ink">
                    {t("quote.checkOutLabel")}
                  </span>
                  <SingleDatePicker
                    value={customEnd ?? ""}
                    onChange={(v) => {
                      setCustomEnd(v);
                      setMonths(null);
                    }}
                    calendarData={calendarQuery.data ?? []}
                    minDate={addDaysStr(moveIn, 28)}
                    markupSource={selected?.source ?? "hostaway"}
                    ariaLabel={t("quote.checkOutLabel")}
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    {t("quote.checkOutHint")}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4 — summary */}
            {step === 4 && selected && (
              <div className="mt-4">
                <dl className="text-sm">
                  {[
                    {
                      label: t("quote.step1Title"),
                      value: `${selectedTitle} · ${[selected.city, selected.state].filter(Boolean).join(", ")}`,
                      goto: 1,
                    },
                    {
                      label: t("quote.step2Title"),
                      value: formatDateForDisplay(moveIn),
                      goto: 2,
                    },
                    {
                      label: t("quote.step3Title"),
                      value: `${
                        months != null
                          ? t("quote.monthsShort", { count: months })
                          : t("quote.nightsCount", {
                              count: nightsBetween(moveIn, moveOut),
                            })
                      } · ${formatDateForDisplay(moveIn)} → ${formatDateForDisplay(moveOut)}`,
                      goto: 3,
                    },
                  ].map((row) => (
                    <div
                      key={row.goto}
                      className="flex items-center justify-between gap-4 py-2.5 border-b border-neutral-100"
                    >
                      <div className="min-w-0">
                        <dt className="text-xs text-neutral-500">
                          {row.label}
                        </dt>
                        <dd className="text-sm font-medium text-ink truncate">
                          {row.value}
                        </dd>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(row.goto)}
                        className="shrink-0 text-[13px] font-semibold text-ink underline underline-offset-4"
                      >
                        {t("quote.change")}
                      </button>
                    </div>
                  ))}
                </dl>

                {quote ? (
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between text-neutral-600">
                      <span>
                        {t("quote.nightlyTotal", { count: quote.nights })}
                      </span>
                      <span className="line-through">
                        {fmt(quote.nightlyTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 text-green-700 font-medium">
                      <span>
                        {t("quote.monthlyDiscount", {
                          percent: Math.round(quote.discount * 100),
                        })}
                      </span>
                      <span>−{fmt(quote.savings)}</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-neutral-200">
                      <span className="font-semibold text-ink">
                        {t("quote.yourRate")}
                      </span>
                      <span className="text-right">
                        <span className="block text-xl font-semibold text-ink">
                          {fmt(quote.perMonth)}
                          <span className="text-sm font-normal text-neutral-600">
                            {t("quote.perMonth")}
                          </span>
                        </span>
                        {(months != null ? months > 1 : quote.nights > 31) && (
                          <span className="block text-xs text-neutral-500">
                            {months != null
                              ? t("quote.termTotal", {
                                  months,
                                  total: fmt(quote.monthlyTotal),
                                })
                              : t("quote.termTotalNights", {
                                  nights: quote.nights,
                                  total: fmt(quote.monthlyTotal),
                                })}
                          </span>
                        )}
                      </span>
                    </div>
                    {quote.estimated && (
                      <p className="mt-2 text-xs text-neutral-500">
                        {t("quote.estimatedNote")}
                      </p>
                    )}
                    {quote.conflicts > 0 && (
                      <p className="mt-2 text-xs text-amber-700">
                        {t("quote.conflictNote", { count: quote.conflicts })}
                      </p>
                    )}


                    <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={scrollToForm}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Calendar className="w-4 h-4" aria-hidden="true" />
                        {t("quote.requestRate")}
                      </button>
                      {whatsappHref && (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-neutral-300 text-[15px] font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
                        >
                          <SiWhatsapp className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                          WhatsApp
                        </a>
                      )}
                      {lineHref && (
                        <a
                          href={lineHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-neutral-300 text-[15px] font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
                        >
                          <SiLine className="w-4 h-4 text-[#06C755]" aria-hidden="true" />
                          LINE
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-neutral-500 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      {t("quote.negotiateNote")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-neutral-600">
                    {calendarQuery.isLoading
                      ? t("quote.loadingRates")
                      : t("quote.noRates")}
                  </p>
                )}
              </div>
            )}

            {/* Step navigation */}
            {step < 4 && (
              <div className="mt-6 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-sm font-semibold text-neutral-600 hover:text-ink underline underline-offset-4"
                  >
                    {t("quote.back")}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !selected) ||
                    (step === 2 && !moveIn) ||
                    (step === 3 && !hasTerm)
                  }
                  className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("quote.continue")}
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Partner site — monthly rentals across the rest of Thailand */}
        <a
          href="https://www.monthlyfinder.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3.5 hover:bg-neutral-50 transition-colors"
        >
          <span className="w-9 h-9 rounded-full bg-neutral-100 grid place-items-center shrink-0">
            <Globe
              className="w-[18px] h-[18px] text-ink"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </span>
          <span className="flex-1 min-w-0 basis-52">
            <span className="block text-[15px] font-semibold text-ink">
              {t("quote.partnerTitle")}
            </span>
            <span className="block text-[13px] text-neutral-600">
              {t("quote.partnerBody")}
            </span>
          </span>
          <span className="shrink-0 inline-flex items-center gap-1.5 text-[15px] font-bold text-ink underline underline-offset-4">
            monthlyfinder.com
            <ExternalLink className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </span>
        </a>
          </div>

        {/* Contact card — Request Details / Schedule Viewing tabs */}
        <div
          ref={formRef}
          className="mt-10 lg:mt-0 scroll-mt-24 lg:sticky lg:top-24 rounded-2xl border border-neutral-200 p-5 sm:p-6"
        >
          <div
            role="tablist"
            aria-label={t("form.anyQuestions")}
            className="grid grid-cols-2 border-b border-neutral-200"
          >
            {(
              [
                ["details", t("viewing.tabRequest")],
                ["viewing", t("viewing.tabViewing")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={panelTab === key}
                onClick={() => setPanelTab(key)}
                className={`h-11 -mb-px border-b-2 text-[15px] font-semibold transition-colors ${
                  panelTab === key
                    ? "text-ink border-ink"
                    : "text-neutral-500 border-transparent hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Schedule viewing — only dates the calendar marks free */}
          {panelTab === "viewing" && (
            <div className="mt-5">
              {!selected ? (
                <p className="text-sm text-neutral-600">
                  {t("viewing.pickPropertyFirst")}
                </p>
              ) : calendarQuery.isLoading ? (
                <p className="text-sm text-neutral-600">
                  {t("viewing.loadingDates")}
                </p>
              ) : viewableDays.length === 0 ? (
                <p className="text-sm text-neutral-600">
                  {t("viewing.noDates")}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewOffset((o) => Math.max(0, o - 3))}
                      disabled={viewOffset === 0}
                      aria-label={t("viewing.prevDates")}
                      className="w-9 h-9 rounded-full border border-neutral-300 grid place-items-center shrink-0 text-ink hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <div className="grid grid-cols-3 gap-2 flex-1 min-w-0">
                      {viewableDays
                        .slice(viewOffset, viewOffset + 3)
                        .map((d) => {
                          const dt = new Date(`${d}T00:00:00`);
                          const sel = d === viewDate;
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setViewDate(d)}
                              aria-pressed={sel}
                              className={`rounded-xl border px-1 py-3 text-center transition-colors ${
                                sel
                                  ? "bg-ink text-white border-ink"
                                  : "bg-white text-ink border-neutral-300 hover:border-ink"
                              }`}
                            >
                              <span
                                className={`block text-[10px] font-semibold uppercase tracking-wide truncate ${
                                  sel ? "text-white/70" : "text-neutral-500"
                                }`}
                              >
                                {dt.toLocaleDateString(
                                  locale === "th" ? "th-TH" : "en-GB",
                                  { weekday: "long" },
                                )}
                              </span>
                              <span className="block text-2xl font-bold leading-8">
                                {dt.getDate()}
                              </span>
                              <span
                                className={`block text-[11px] font-semibold uppercase tracking-wide ${
                                  sel ? "text-white/70" : "text-neutral-500"
                                }`}
                              >
                                {dt.toLocaleDateString(
                                  locale === "th" ? "th-TH" : "en-GB",
                                  { month: "short" },
                                )}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setViewOffset((o) =>
                          Math.min(o + 3, Math.max(0, viewableDays.length - 3)),
                        )
                      }
                      disabled={viewOffset + 3 >= viewableDays.length}
                      aria-label={t("viewing.nextDates")}
                      className="w-9 h-9 rounded-full border border-neutral-300 grid place-items-center shrink-0 text-ink hover:border-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={scheduleViewing}
                    disabled={!viewDate}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white text-[15px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    {t("viewing.cta")}
                  </button>
                  <p className="mt-2.5 text-center text-xs text-neutral-500">
                    {t("viewing.freeNote")}
                  </p>
                </>
              )}
            </div>
          )}

          {panelTab === "details" && (
          <div className="mt-5">
          <p className="text-sm text-neutral-600">{t("form.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="inq-name"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  {t("form.labels.fullName")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="inq-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("form.placeholders.fullName")}
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="inq-email"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  {t("form.labels.email")}{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="inq-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm({ ...form, email: value });
                    setErrors((prev) => ({
                      ...prev,
                      email:
                        value && !validateEmail(value)
                          ? t("validation.invalidEmail")
                          : undefined,
                    }));
                  }}
                  placeholder={t("form.placeholders.email")}
                  className={`${inputCls} ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="inq-phone"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  {t("form.labels.phone")}
                </label>
                <div className="flex gap-2">
                  <select
                    value={form.countryCode}
                    onChange={(e) =>
                      setForm({ ...form, countryCode: e.target.value })
                    }
                    className="w-[110px] rounded-lg border border-neutral-300 bg-white px-2 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                    aria-label={t("form.labels.phone")}
                  >
                    {COUNTRY_CODES.map((cc) => (
                      <option key={cc.value} value={cc.value}>
                        {cc.code} {cc.country}
                      </option>
                    ))}
                  </select>
                  <input
                    id="inq-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm({ ...form, phone: value });
                      setErrors((prev) => ({
                        ...prev,
                        phone:
                          value && !validatePhone(value)
                            ? t("validation.invalidPhone")
                            : undefined,
                      }));
                    }}
                    placeholder={t("form.placeholders.phone")}
                    className={`flex-1 ${inputCls} ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="inq-tenants"
                  className="block text-sm font-medium text-ink mb-1"
                >
                  {t("form.labels.tenants")}
                </label>
                <input
                  id="inq-tenants"
                  type="number"
                  min="1"
                  value={form.tenants}
                  onChange={(e) =>
                    setForm({ ...form, tenants: e.target.value })
                  }
                  placeholder={t("form.placeholders.tenants")}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="inq-message"
                className="block text-sm font-medium text-ink mb-1"
              >
                {t("form.labels.message")}
              </label>
              <textarea
                id="inq-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={600}
                placeholder={t("form.placeholders.message")}
                className={`${inputCls} min-h-[120px]`}
              />
              <div className="mt-1 text-right text-xs text-neutral-400">
                {form.message.length}/600
              </div>
            </div>

            {submitStatus === "success" && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-sm text-green-800">
                  {t("form.successMessage")}
                </p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-sm text-red-700">
                  {t("form.errorMessage", { email: SUPPORT_EMAIL })}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  {t("form.submitting")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {t("form.submit")}
                </>
              )}
            </button>
          </form>
          </div>
          )}

          {/* Contact details — always visible under either tab */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <p className="text-[15px] font-bold text-ink">
              {t("form.anyQuestions")}
            </p>
            <div className="mt-4 grid grid-cols-[24px_minmax(0,1fr)] gap-x-3.5 gap-y-4 items-center">
              {CONTACT_PHONE && (
                <>
                  <Phone
                    className="w-5 h-5 text-ink justify-self-center"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <a
                    href={`tel:${CONTACT_PHONE_TEL || CONTACT_PHONE.replace(/[^+\d]/g, "")}`}
                    className="justify-self-start text-[15px] font-semibold text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
                  >
                    {CONTACT_PHONE}
                  </a>
                </>
              )}
              {CONTACT_WHATSAPP && (
                <>
                  <SiWhatsapp
                    className="w-5 h-5 text-ink justify-self-center"
                    aria-hidden="true"
                  />
                  <a
                    href={`https://wa.me/${CONTACT_WHATSAPP.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="justify-self-start text-[15px] font-semibold text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
                  >
                    {CONTACT_WHATSAPP} (WhatsApp)
                  </a>
                </>
              )}
              {CONTACT_LINE && (
                <>
                  <SiLine
                    className="w-5 h-5 text-ink justify-self-center"
                    aria-hidden="true"
                  />
                  <a
                    href={`https://line.me/R/ti/p/${encodeURIComponent(CONTACT_LINE)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="justify-self-start text-[15px] font-semibold text-ink underline underline-offset-4 decoration-1 hover:decoration-2"
                  >
                    {CONTACT_LINE} (LINE)
                  </a>
                </>
              )}
              <Mail
                className="w-5 h-5 text-ink justify-self-center"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="justify-self-start text-[15px] font-semibold text-ink underline underline-offset-4 decoration-1 hover:decoration-2 break-all"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}

export default function MonthlyInquiryPage() {
  return (
    <Suspense fallback={null}>
      <MonthlyStays />
    </Suspense>
  );
}
