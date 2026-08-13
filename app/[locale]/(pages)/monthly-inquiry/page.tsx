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
  Calendar,
  Check,
  Loader2,
  MessageCircle,
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
  const [pickerOpen, setPickerOpen] = useState(false);

  // Resolve the arriving property once inventory is in: pid first, then the
  // legacy ?property= name.
  useEffect(() => {
    if (selectedKey || listings.length === 0) return;
    if (pidParam) {
      const hit = listings.find((l) => `${l.source}:${l.id}` === pidParam);
      if (hit) {
        setSelectedKey(pidParam);
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
  const [months, setMonths] = useState<number>(1);

  const moveOut = useMemo(
    () => (moveIn ? addMonthsClamped(moveIn, months) : ""),
    [moveIn, months],
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
      perMonth: Math.round(monthlyTotal / months),
      savings: nightlyTotal - monthlyTotal,
      estimated: missing > 0,
      conflicts,
    };
  }, [selected, moveIn, moveOut, months, calendarQuery.data]);

  const fmt = (n: number) => `฿${n.toLocaleString()}`;

  // The message that travels to the form, WhatsApp and LINE.
  const quoteMessage = useMemo(() => {
    if (!selected || !quote) return "";
    return t("quote.chatMessage", {
      property: selectedTitle,
      moveIn: formatDateForDisplay(moveIn),
      months,
      rate: fmt(quote.perMonth),
    });
  }, [selected, quote, selectedTitle, moveIn, months, t]);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

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
    setForm((prev) => ({
      ...prev,
      message: prev.message || quoteMessage,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Header */}
        <h1 className="text-2xl md:text-[28px] font-semibold text-ink">
          {t("quote.pageTitle")}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-600 max-w-[65ch]">
          {t("quote.pageSubtitle")}
        </p>

        {/* How it works */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl">
          {(["stepDates", "stepRate", "stepConfirm"] as const).map(
            (key, i) => (
              <div key={key} className="rounded-2xl border border-neutral-200 px-3.5 py-3">
                <p className="text-xs font-semibold text-neutral-500">
                  {i + 1}
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-ink leading-snug">
                  {t(`quote.${key}`)}
                </p>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-12 lg:items-start">
          <div className="min-w-0">
        {/* Property context */}
        <div>
          {selected ? (
            <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4">
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
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink truncate">
                  {selectedTitle}
                </p>
                <p className="mt-0.5 text-[13px] text-neutral-600 flex flex-wrap items-center gap-x-1.5">
                  {selected.averageReviewRating ? (
                    <span className="inline-flex items-center gap-1 font-medium text-ink">
                      <Star
                        className="w-3 h-3 fill-current"
                        aria-hidden="true"
                      />
                      {(selected.averageReviewRating > 5
                        ? selected.averageReviewRating / 2
                        : selected.averageReviewRating
                      ).toFixed(1)}
                    </span>
                  ) : null}
                  {selected.averageReviewRating ? (
                    <span aria-hidden="true">·</span>
                  ) : null}
                  <span className="truncate">
                    {[selected.city, selected.state]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="shrink-0 text-sm font-semibold text-ink underline underline-offset-4"
              >
                {t("quote.change")}
              </button>
            </div>
          ) : (
            <p className="text-[15px] font-medium text-ink">
              {isLoadingInventory
                ? t("quote.loadingProperties")
                : t("quote.pickProperty")}
            </p>
          )}

          {/* Picker strip */}
          {(pickerOpen || (!selected && !isLoadingInventory)) && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listings.map((l) => {
                const key = `${l.source}:${l.id}`;
                const title = displayPropertyName(l);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedKey(key);
                      setPickerOpen(false);
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

        {/* Quote */}
        {selected && (
          <div className="mt-6 rounded-2xl border border-neutral-200 p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-ink">
                  {t("form.labels.moveIn")}
                </label>
                <input
                  type="date"
                  min={today}
                  value={moveIn}
                  onChange={(e) => setMoveIn(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-ink">
                  {t("quote.lengthLabel")}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {MONTH_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      aria-pressed={months === m}
                      className={`h-10 px-3.5 rounded-lg border text-sm font-semibold transition-colors ${
                        months === m
                          ? "bg-ink text-white border-ink"
                          : "bg-white text-ink border-neutral-300 hover:border-ink"
                      }`}
                    >
                      {t("quote.monthsShort", { count: m })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {quote ? (
              <div className="mt-5 pt-4 border-t border-neutral-200 text-sm">
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
                <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-neutral-100">
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
                    {months > 1 && (
                      <span className="block text-xs text-neutral-500">
                        {t("quote.termTotal", {
                          months,
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

                {/* Included */}
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["incUtilities", "incWifi", "incTaxes"] as const).map(
                    (key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2 text-[13px] text-neutral-700"
                      >
                        <Check
                          className="w-4 h-4 text-green-700 shrink-0"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {t(`quote.${key}`)}
                      </li>
                    ),
                  )}
                </ul>

                {/* CTAs */}
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
              <p className="mt-5 pt-4 border-t border-neutral-200 text-sm text-neutral-600">
                {calendarQuery.isLoading
                  ? t("quote.loadingRates")
                  : t("quote.noRates")}
              </p>
            )}
          </div>
        )}

          </div>

        {/* Inquiry form — card column on desktop, in flow on mobile */}
        <div
          ref={formRef}
          className="mt-10 lg:mt-0 scroll-mt-24 lg:sticky lg:top-24 rounded-2xl border border-neutral-200 p-5 sm:p-6"
        >
          <h2 className="text-xl font-semibold normal-case tracking-normal text-ink">
            {t("form.title")}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{t("form.subtitle")}</p>

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
