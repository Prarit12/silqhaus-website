"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  CalendarDays,
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  Share,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { SiAirbnb } from "react-icons/si";
import dynamic from "next/dynamic";
import Lightbox from "@/components/lightbox";
import FullScreenGallery from "@/components/full-screen-gallery";
import { GalleryCarousel } from "@/components/gallery-carousel";
import { DateRangePicker } from "@/components/date-range-picker";
import { BookingConditions } from "@/components/booking-conditions";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { useTranslations, useLocale } from "next-intl";
import { PropertyReviews } from "@/components/property-reviews";

const PropertyMap = dynamic(() => import("@/components/property-map"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-neutral-100 animate-pulse rounded-2xl" />
  ),
});

const NearbyListingsCarousel = dynamic(
  () => import("@/components/nearby-listings-carousel"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-neutral-100 animate-pulse rounded-2xl" />
    ),
  },
);
import { fetchListingById } from "@/lib/api/hostaway";
import { createPropertySlug } from "@/lib/slugify";
import { displayPropertyName } from "@/config/property-names";
import {
  areaKeyForCity,
  propertySizeSqm,
  propertyTypeKey,
} from "@/config/property-facts";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import {
  GUESTY_OTA_MARKUPS,
  BOOKING_COM_URLS,
  calculateOTAPrice,
  calculateSilqhausPrice,
} from "@/config/ota-markups";

interface PropertyImage {
  url: string;
  caption: string | null;
}

interface PropertyAmenity {
  id: number;
  amenityName: string;
}

interface Property {
  id: number | string;
  name: string;
  nickname?: string;
  description?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  price: number;
  priceBase?: number;
  currencyCode: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  roomType?: string;
  lat?: number;
  lng?: number;
  images: PropertyImage[];
  listingAmenities: PropertyAmenity[];
  address?: string;
  airbnbListingUrl?: string;
  vrboListingUrl?: string;
  bookingcomListingUrl?: string;
  googleVrListingUrl?: string;
  expediaListingUrl?: string;
  tripcomListingUrl?: string;
  cleaningFee?: number;
  guestsIncluded?: number;
  priceForExtraPerson?: number;
  averageReviewRating?: number;
  /** "15:00" (Guesty) or "15" (Hostaway hour). */
  checkInTime?: string;
  checkOutTime?: string;
  /** Hostaway policy slug (flexible/moderate/firm/strict). */
  cancellationPolicy?: string;
  propertyType?: string;
  propertyTypeId?: number;
  areaSqm?: number;
  neighborhoodOverview?: string;
}

interface PropertyApiResult {
  id: number | string;
  name: string;
  nickname?: string;
  description?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  price?: number;
  priceBase?: number;
  currencyCode?: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  roomType?: string;
  lat?: number;
  lng?: number;
  listingImages?: Array<{ url: string; caption?: string | null }>;
  listingAmenities?: PropertyAmenity[];
  address?: string;
  airbnbListingUrl?: string;
  vrboListingUrl?: string;
  bookingcomListingUrl?: string;
  googleVrListingUrl?: string;
  expediaListingUrl?: string;
  tripcomListingUrl?: string;
  cleaningFee?: number;
  guestsIncluded?: number;
  priceForExtraPerson?: number;
  averageReviewRating?: number;
  /** Hostaway: check-in hour as a number (15). */
  checkInTimeStart?: number | string;
  /** Guesty normalized "15:00"; Hostaway raw hour number. */
  checkInTime?: string;
  checkOutTime?: number | string;
  cancellationPolicy?: string;
  propertyType?: string;
  propertyTypeId?: number;
  areaSqm?: number;
  /** Guesty normalized; Hostaway raw Airbnb field below. */
  neighborhoodOverview?: string;
  airbnbNeighborhoodOverview?: string;
}

interface HostawayApiResponse {
  result: PropertyApiResult;
}

function normalizeProperty(data: HostawayApiResponse): Property {
  const r = data.result;
  return {
    id: r.id,
    name: r.name,
    nickname: r.nickname,
    description: r.description,
    city: r.city,
    state: r.state,
    countryCode: r.countryCode,
    price: r.price ?? 0,
    priceBase: r.priceBase,
    currencyCode: r.currencyCode ?? "",
    personCapacity: r.personCapacity,
    bedroomsNumber: r.bedroomsNumber,
    bathroomsNumber: r.bathroomsNumber,
    lat: r.lat,
    lng: r.lng,
    images: (r.listingImages || []).map((img) => ({
      url: img.url,
      caption: img.caption ?? null,
    })),
    listingAmenities: r.listingAmenities || [],
    address: r.address || "",
    airbnbListingUrl: r.airbnbListingUrl || "",
    vrboListingUrl: r.vrboListingUrl || "",
    bookingcomListingUrl:
      r.bookingcomListingUrl ||
      (typeof r.id === "number" ? BOOKING_COM_URLS[r.id] : "") ||
      "",
    googleVrListingUrl: r.googleVrListingUrl || "",
    expediaListingUrl: r.expediaListingUrl || "",
    tripcomListingUrl: r.tripcomListingUrl || "",
    cleaningFee: r.cleaningFee || 0,
    guestsIncluded: r.guestsIncluded || 1,
    priceForExtraPerson: r.priceForExtraPerson || 0,
    averageReviewRating: r.averageReviewRating,
    checkInTime:
      r.checkInTime ??
      (r.checkInTimeStart != null ? String(r.checkInTimeStart) : undefined),
    checkOutTime: r.checkOutTime != null ? String(r.checkOutTime) : undefined,
    cancellationPolicy: r.cancellationPolicy,
    propertyType: r.propertyType,
    propertyTypeId:
      typeof r.propertyTypeId === "number" ? r.propertyTypeId : undefined,
    areaSqm: typeof r.areaSqm === "number" ? r.areaSqm : undefined,
    neighborhoodOverview:
      (r.neighborhoodOverview || r.airbnbNeighborhoodOverview || "").trim() ||
      undefined,
    roomType:
      r.roomType
        ?.replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "",
  };
}

interface PropertyDetailsProps {
  propertyId: string;
  source?: "hostaway" | "guesty";
  initialListing?: {
    id: number | string;
    name: string;
    nickname?: string;
    description?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    personCapacity?: number;
    bedroomsNumber?: number;
    bathroomsNumber?: number;
    listingImages?: Array<{ url: string; caption?: string | null }>;
  };
}

/** Prose that clamps itself and grows a "Show more" toggle only when needed. */
function ExpandableText({
  text,
  showMoreLabel,
  showLessLabel,
}: {
  text: string;
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  return (
    <div>
      <div
        ref={ref}
        className={`text-[15px] leading-relaxed text-ink/90 whitespace-pre-line max-w-[75ch] ${
          expanded ? "" : "line-clamp-[8]"
        }`}
      >
        {text}
      </div>
      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 text-[15px] font-semibold text-ink underline underline-offset-4 hover:text-ink"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}

/** Share pill: native share sheet where available, copy-link elsewhere. */
function ShareButton({
  title,
  shareLabel,
  copiedLabel,
  ariaLabel,
}: {
  title: string;
  shareLabel: string;
  copiedLabel: string;
  ariaLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        // Guest closed the share sheet.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing sensible to do.
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white text-ink hover:text-ink text-sm px-4 py-2 hover:border-ink transition-colors"
    >
      {copied ? (
        <Check className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Share className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
      )}
      {copied ? copiedLabel : shareLabel}
    </button>
  );
}

export default function PropertyDetails({
  propertyId,
  source = "hostaway",
  initialListing,
}: PropertyDetailsProps) {
  const isGuesty = source === "guesty";
  const airbnbMarkup = isGuesty ? GUESTY_OTA_MARKUPS.airbnb : 19;
  const bookingMarkup = isGuesty ? GUESTY_OTA_MARKUPS.booking : 20;
  const vrboMarkup = isGuesty ? GUESTY_OTA_MARKUPS.vrbo : 20;
  const expediaMarkup = isGuesty ? GUESTY_OTA_MARKUPS.expedia : 20;
  const tripcomMarkup = isGuesty ? GUESTY_OTA_MARKUPS.tripcom : 18;
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("propertyDetail");
  const locale = useLocale();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [fullGalleryOpen, setFullGalleryOpen] = useState(false);
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    const ci = searchParams.get("checkIn");
    const co = searchParams.get("checkOut");
    if (ci) setCheckInDate(ci);
    if (co) setCheckOutDate(co);
  }, [searchParams]);
  const [guestCount, setGuestCount] = useState(1);
  const [pricingData, setPricingData] = useState<{
    totalPrice: number;
    nights: number;
    averageNightlyRate: number;
    unavailableDates: string[];
    minimumStay: number;
    isLoading: boolean;
    error: string | null;
  }>({
    totalPrice: 0,
    nights: 0,
    averageNightlyRate: 0,
    unavailableDates: [],
    minimumStay: 1,
    isLoading: false,
    error: null,
  });

  const [calendarData, setCalendarData] = useState<{
    calendar: Array<{
      date: string;
      price: number;
      isAvailable: number;
      status: string;
      minimumStay?: number;
      cta?: boolean;
      ctd?: boolean;
    }>;
    minimumStay: number;
    isLoading: boolean;
  }>({
    calendar: [],
    minimumStay: 1,
    isLoading: true,
  });

  const initialData: HostawayApiResponse | undefined = initialListing
    ? { result: initialListing as PropertyApiResult }
    : undefined;

  const {
    data: propertyData,
    isLoading,
    error,
  } = useQuery<HostawayApiResponse>({
    queryKey: ["property", source, propertyId],
    queryFn: async () => {
      if (isGuesty) {
        const res = await fetch(
          `/api/guesty/listings/${encodeURIComponent(propertyId)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = (await res.json()) as PropertyApiResult;
        return { result: data };
      }
      return fetchListingById(propertyId);
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
    initialData,
  });

  const property = useMemo(() => {
    if (!propertyData) return null;
    return normalizeProperty(propertyData);
  }, [propertyData]);

  const extraGuestCost = useMemo(() => {
    if (!property) return 0;
    const pricePerExtraGuest = property.priceForExtraPerson || 0;
    const extraGuests = Math.max(0, guestCount - 1);
    const nights = pricingData.nights || 0;
    return extraGuests * pricePerExtraGuest * nights;
  }, [property, guestCount, pricingData.nights]);

  // Helper to get minimumStay from the selected check-in date
  const getMinimumStayForCheckIn = (): number => {
    if (!checkInDate || !calendarData.calendar.length) return 1;
    const dayData = calendarData.calendar.find(
      (day) => day.date === checkInDate,
    );
    return dayData?.minimumStay || 1;
  };

  // Fetch calendar availability data on component load
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!propertyId) return;

      setCalendarData((prev) => ({ ...prev, isLoading: true }));

      try {
        if (isGuesty) {
          const today = new Date();
          const end = new Date();
          end.setMonth(end.getMonth() + 6);
          const fmt = (d: Date) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

          const response = await fetch(
            `/api/guesty/calendar/${encodeURIComponent(propertyId)}?startDate=${fmt(today)}&endDate=${fmt(end)}`,
          );
          if (!response.ok) {
            setCalendarData((prev) => ({ ...prev, isLoading: false }));
            return;
          }
          const data = await response.json();
          const days: Array<{
            date: string;
            price: number;
            minNights?: number;
            isBlocked?: boolean;
            cta?: boolean;
            ctd?: boolean;
          }> = data.days || [];
          const calendar = days.map((d) => ({
            date: d.date,
            price: d.price || 0,
            isAvailable: d.isBlocked ? 0 : 1,
            status: d.isBlocked ? "reserved" : "available",
            minimumStay: d.minNights || 1,
            cta: !!d.cta,
            ctd: !!d.ctd,
          }));
          setCalendarData({
            calendar,
            minimumStay: data.minimumStay || 1,
            isLoading: false,
          });
          return;
        }

        const response = await fetch(
          `/api/hostaway/availability?listingId=${propertyId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();

        setCalendarData({
          calendar: data.calendar || [],
          minimumStay: data.minimumStay || 1,
          isLoading: false,
        });
      } catch (err) {
        console.error("Availability fetch error:", err);
        setCalendarData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchAvailability();
  }, [propertyId, isGuesty]);

  useEffect(() => {
    const fetchPricing = async () => {
      if (!checkInDate || !checkOutDate || !propertyId) {
        setPricingData((prev) => ({
          ...prev,
          totalPrice: 0,
          nights: 0,
          error: null,
        }));
        return;
      }

      // Use local date parsing to avoid timezone issues
      const [inYear, inMonth, inDay] = checkInDate.split("-").map(Number);
      const [outYear, outMonth, outDay] = checkOutDate.split("-").map(Number);
      const checkIn = new Date(inYear, inMonth - 1, inDay);
      const checkOut = new Date(outYear, outMonth - 1, outDay);

      if (checkOut <= checkIn) {
        setPricingData((prev) => ({
          ...prev,
          error: t("checkoutAfterCheckin"),
          totalPrice: 0,
          nights: 0,
        }));
        return;
      }

      // Calculate nights (checkout day not included)
      const nights = Math.floor(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Check minimum stay requirement from the check-in date
      const minStay = getMinimumStayForCheckIn();
      if (nights < minStay) {
        setPricingData((prev) => ({
          ...prev,
          error: t("minimumStayError", { count: minStay }),
          totalPrice: 0,
          nights: 0,
        }));
        return;
      }

      // Guesty: compute pricing locally from the 6-month calendar already
      // loaded by the effect above. The narrow [checkIn, checkOut] range
      // is fully contained in that calendar, so we can avoid a second
      // upstream Guesty call. Wait until the calendar has loaded.
      if (isGuesty) {
        if (calendarData.isLoading) {
          setPricingData((prev) => ({ ...prev, isLoading: true, error: null }));
          return;
        }
        if (calendarData.calendar.length === 0) {
          // Calendar fetch failed; surface a graceful error and clear
          // any stale totals from a prior valid selection.
          setPricingData((prev) => ({
            ...prev,
            totalPrice: 0,
            nights: 0,
            averageNightlyRate: 0,
            unavailableDates: [],
            isLoading: false,
            error: t("pricingFetchError"),
          }));
          return;
        }

        // Range-coverage guard: ensure every billable night (check-in
        // through checkout-1) exists in the loaded calendar. Protects
        // against URL-manipulated dates beyond the 6-month window.
        const loadedDates = new Set(calendarData.calendar.map((d) => d.date));
        const fmtLocal = (d: Date) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        for (let i = 0; i < nights; i++) {
          const cursor = new Date(checkIn);
          cursor.setDate(cursor.getDate() + i);
          if (!loadedDates.has(fmtLocal(cursor))) {
            setPricingData((prev) => ({
              ...prev,
              totalPrice: 0,
              nights: 0,
              averageNightlyRate: 0,
              unavailableDates: [],
              isLoading: false,
              error: t("pricingFetchError"),
            }));
            return;
          }
        }

        let totalPrice = 0;
        let pricedNights = 0;
        const unavailableDates: string[] = [];
        let rangeMinimumStay = 1;

        for (const day of calendarData.calendar) {
          if (day.date < checkInDate || day.date > checkOutDate) continue;
          // Checkout day: night isn't billed, but check CTD restriction.
          if (day.date === checkOutDate) {
            if (day.ctd) unavailableDates.push(day.date);
            continue;
          }
          // Check-in day: enforce CTA restriction.
          if (day.date === checkInDate && day.cta) {
            unavailableDates.push(day.date);
            continue;
          }
          const ms = day.minimumStay || 1;
          if (ms > rangeMinimumStay) rangeMinimumStay = ms;
          if (day.isAvailable === 0) {
            unavailableDates.push(day.date);
            continue;
          }
          if (day.price > 0) {
            totalPrice += day.price;
            pricedNights++;
          }
        }

        if (unavailableDates.length > 0) {
          setPricingData({
            totalPrice: 0,
            nights: 0,
            averageNightlyRate: 0,
            unavailableDates,
            minimumStay: rangeMinimumStay || calendarData.minimumStay,
            isLoading: false,
            error: t("unavailableDatesError", {
              dates:
                unavailableDates.slice(0, 3).join(", ") +
                (unavailableDates.length > 3 ? "..." : ""),
            }),
          });
        } else {
          setPricingData({
            totalPrice,
            nights: pricedNights,
            averageNightlyRate:
              pricedNights > 0 ? Math.round(totalPrice / pricedNights) : 0,
            unavailableDates: [],
            minimumStay: rangeMinimumStay || calendarData.minimumStay,
            isLoading: false,
            error: null,
          });
        }
        return;
      }

      setPricingData((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const url = `/api/hostaway/calendar?listingId=${propertyId}&startDate=${checkInDate}&endDate=${checkOutDate}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch pricing");
        }

        const data = await response.json();

        if (data.unavailableDates && data.unavailableDates.length > 0) {
          setPricingData({
            totalPrice: 0,
            nights: 0,
            averageNightlyRate: 0,
            unavailableDates: data.unavailableDates,
            minimumStay: data.minimumStay || calendarData.minimumStay,
            isLoading: false,
            error: t("unavailableDatesError", {
              dates:
                data.unavailableDates.slice(0, 3).join(", ") +
                (data.unavailableDates.length > 3 ? "..." : ""),
            }),
          });
        } else {
          setPricingData({
            totalPrice: data.totalPrice,
            nights: data.nights,
            averageNightlyRate: data.averageNightlyRate,
            unavailableDates: [],
            minimumStay: data.minimumStay || calendarData.minimumStay,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        setPricingData((prev) => ({
          ...prev,
          isLoading: false,
          error: t("pricingFetchError"),
        }));
      }
    };

    fetchPricing();
  }, [
    checkInDate,
    checkOutDate,
    propertyId,
    calendarData.calendar,
    calendarData.minimumStay,
    calendarData.isLoading,
    isGuesty,
    t,
  ]);

  // Close the mobile booking sheet with Escape.
  useEffect(() => {
    if (!mobileBookingOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileBookingOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileBookingOpen]);

  // ------------------------------------
  // Image handling (JSON only)
  // ------------------------------------
  const propertyPhotos =
    property?.images && property.images.length > 0 ? property.images : [];

  const lightboxImages = propertyPhotos.map((img) => ({
    src: img.url,
    alt: img.caption
      ? `${property?.name || "Property"} - ${img.caption}`
      : property?.name || "Property",
  }));

  // ------------------------------------
  // Helpers
  // ------------------------------------
  // Approximate THB→USD rate for a secondary display. Fixed (not a live FX call)
  // so it introduces no new connection; override via env when the rate moves.
  const THB_PER_USD = Number(process.env.NEXT_PUBLIC_THB_PER_USD) || 36;
  const formatPriceForDisplay = (price: number, currency: string) => {
    const base = `${currency} ${price.toLocaleString()}`;
    if (currency === "THB") {
      const usd = Math.round(price / THB_PER_USD);
      return `${base} · ~$${usd.toLocaleString()}`;
    }
    return base;
  };

  // ------------------------------------
  // States
  // ------------------------------------
  if (isLoading || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    router.push("/our-property");
    return null;
  }

  // The guest-facing name; slugs and metadata stay on property.name.
  const title = displayPropertyName({
    id: property.id,
    source,
    name: property.name,
    nickname: property.nickname,
  });

  const location = [property.city, property.state].filter(Boolean).join(", ");

  // Hostaway scores reviews out of 10; guests read stars out of 5.
  const rawRating = Number(property.averageReviewRating);
  const rating =
    Number.isFinite(rawRating) && rawRating > 0
      ? (rawRating > 5 ? rawRating / 2 : rawRating).toFixed(1)
      : null;

  const priced = pricingData.totalPrice > 0 && !pricingData.isLoading;
  const silqhausTotal = priced
    ? calculateSilqhausPrice(
        pricingData.totalPrice,
        extraGuestCost,
        property.cleaningFee || 0,
        source,
      )
    : 0;
  const silqhausNightly =
    priced && pricingData.nights > 0
      ? Math.round(silqhausTotal / pricingData.nights)
      : 0;

  const silqhausBookingUrl = isGuesty
    ? `https://silqhaus.guestybookings.com/${locale}/properties/${property.id}?minOccupancy=${guestCount}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
    : `https://silqhaus.holidayfuture.com/listings/${property.id}?start=${checkInDate}&end=${checkOutDate}&numberOfGuests=${guestCount}`;

  // Every external platform this property is bookable on, with the marked-up
  // total a guest would pay there. Rendered as compact comparison rows.
  const otaOffers: Array<{
    key: string;
    name: string;
    markup: number;
    href: string;
    ariaLabel: string;
    badge: React.ReactNode;
  }> = [];
  if (priced) {
    if (property.airbnbListingUrl) {
      otaOffers.push({
        key: "airbnb",
        name: "Airbnb",
        markup: airbnbMarkup,
        href: `${property.airbnbListingUrl}?guests=${guestCount}&adults=${guestCount}&check_in=${checkInDate}&check_out=${checkOutDate}`,
        ariaLabel: t("bookOnAirbnb"),
        badge: (
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF5A5F]">
            <SiAirbnb className="w-4 h-4 text-white" aria-hidden="true" />
          </span>
        ),
      });
    }
    if (property.bookingcomListingUrl) {
      let bookingHref = property.bookingcomListingUrl;
      try {
        const u = new URL(property.bookingcomListingUrl);
        u.searchParams.set("checkin", checkInDate);
        u.searchParams.set("checkout", checkOutDate);
        u.searchParams.set("no_rooms", "1");
        u.searchParams.set("req_adults", String(guestCount));
        bookingHref = u.toString();
      } catch {
        // Malformed URL from the PMS — link to it untouched.
      }
      otaOffers.push({
        key: "booking",
        name: "Booking.com",
        markup: bookingMarkup,
        href: bookingHref,
        ariaLabel: t("bookOnBookingCom"),
        badge: (
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#003580]">
            <span className="text-white font-bold text-[9px]">B.com</span>
          </span>
        ),
      });
    }
    if (property.vrboListingUrl) {
      otaOffers.push({
        key: "vrbo",
        name: "Vrbo",
        markup: vrboMarkup,
        href: `${property.vrboListingUrl}?startDate=${checkInDate}&endDate=${checkOutDate}&chkin=${checkInDate}&chkout=${checkOutDate}`,
        ariaLabel: t("bookOnVrbo"),
        badge: (
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3B5998]">
            <span className="text-white font-bold text-[9px]">Vrbo</span>
          </span>
        ),
      });
    }
    if (property.expediaListingUrl) {
      otaOffers.push({
        key: "expedia",
        name: "Expedia",
        markup: expediaMarkup,
        href: property.expediaListingUrl,
        ariaLabel: t("bookOnExpedia"),
        badge: (
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FFCC00]">
            <span className="text-[#1A1A1A] font-bold text-[9px]">Exp</span>
          </span>
        ),
      });
    }
    if (property.tripcomListingUrl) {
      otaOffers.push({
        key: "tripcom",
        name: "Trip.com",
        markup: tripcomMarkup,
        href: `${property.tripcomListingUrl}?checkIn=${checkInDate}&checkOut=${checkOutDate}`,
        ariaLabel: t("bookOnTripcom"),
        badge: (
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#287DFA]">
            <span className="text-white font-bold text-[9px]">Trip</span>
          </span>
        ),
      });
    }
  }

  const amenities = property.listingAmenities || [];
  const visibleAmenities = amenitiesExpanded ? amenities : amenities.slice(0, 10);

  // Old Guesty listings without a loaded calendar can't be priced or booked;
  // hide the whole booking surface for them (desktop card and mobile bar).
  const bookable =
    !isGuesty || calendarData.isLoading || calendarData.calendar.length > 0;

  // Stat strip under the gallery: type → bedrooms → bathrooms → size → guests.
  // Cells render only when the fact exists (size is config + PMS driven).
  const typeKey = propertyTypeKey({
    propertyType: property.propertyType,
    propertyTypeId: property.propertyTypeId,
  });
  const sizeSqm = propertySizeSqm({
    id: property.id,
    source,
    areaSqm: property.areaSqm,
  });
  const factCells: Array<{
    key: string;
    icon: LucideIcon;
    value: string;
    label: string;
  }> = [];
  if (typeKey || property.roomType) {
    factCells.push({
      key: "type",
      icon: Building2,
      value: typeKey ? t(`facts.typeNames.${typeKey}`) : property.roomType!,
      label: t("facts.type"),
    });
  }
  if (property.bedroomsNumber) {
    factCells.push({
      key: "bedrooms",
      icon: Bed,
      value: String(property.bedroomsNumber),
      label: t("facts.bedrooms"),
    });
  }
  if (property.bathroomsNumber) {
    factCells.push({
      key: "bathrooms",
      icon: Bath,
      value: String(property.bathroomsNumber),
      label: t("facts.bathrooms"),
    });
  }
  if (sizeSqm) {
    factCells.push({
      key: "size",
      icon: Ruler,
      value: `${sizeSqm.toLocaleString()} m²`,
      label: t("facts.size"),
    });
  }
  if (property.personCapacity) {
    factCells.push({
      key: "guests",
      icon: Users,
      value: String(property.personCapacity),
      label: t("facts.maxGuests"),
    });
  }
  const FACT_COLS: Record<number, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
  };

  /** Quiet help rows below the booking card: monthly stays and contact.
   *  Whole row is the link; the underlined action carries the affordance. */
  const supportLinkRow = (
    href: string,
    icon: React.ReactNode,
    question: string,
    action: string,
  ) => (
    <Link
      href={href as any}
      className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 hover:bg-neutral-50 transition-colors"
    >
      <span className="w-9 h-9 rounded-full bg-neutral-100 grid place-items-center shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0 text-[15px] font-semibold text-ink">
        {question}
      </span>
      <span className="shrink-0 text-[15px] font-bold text-ink underline underline-offset-4">
        {action}
      </span>
    </Link>
  );
  const supportLinks = (
    <div className="mt-3 space-y-3">
      {supportLinkRow(
        `/monthly-inquiry?pid=${source}:${property.id}&property=${encodeURIComponent(property.name || "")}${checkInDate ? `&checkIn=${checkInDate}` : ""}`,
        <CalendarDays
          className="w-[18px] h-[18px] text-ink"
          strokeWidth={1.5}
          aria-hidden="true"
        />,
        t("monthlyQuestion"),
        t("monthlyAction"),
      )}
      {supportLinkRow(
        "/contact-us",
        <MessageCircle
          className="w-[18px] h-[18px] text-ink"
          strokeWidth={1.5}
          aria-hidden="true"
        />,
        t("contactQuestion"),
        t("contactAction"),
      )}
    </div>
  );

  /** The booking panel, rendered twice: desktop sticky card and mobile sheet.
   *  The sheet needs the calendar inline — its scroll container would clip an
   *  absolutely-positioned popup. */
  const renderBookingPanel = ({ inlineCalendar = false } = {}) => (
    <div>
      {/* Price header */}
      <div className="mb-4">
        {priced ? (
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-xl font-semibold text-ink">
              ฿{silqhausTotal.toLocaleString()}
            </span>
            <span className="text-[15px] text-neutral-600">
              {t("forNights", { count: pricingData.nights })}
            </span>
          </p>
        ) : (
          <p className="text-[15px] font-medium text-ink">
            {t("addDatesForPrices")}
          </p>
        )}
      </div>

      <DateRangePicker
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onCheckInChange={setCheckInDate}
        onCheckOutChange={setCheckOutDate}
        calendarData={calendarData.calendar}
        minimumStay={calendarData.minimumStay}
        isLoading={calendarData.isLoading}
        applyMarkup={!isGuesty}
        markupSource={source}
        onError={(error) => setPricingData((prev) => ({ ...prev, error }))}
        inlineCalendar={inlineCalendar}
      />

      {/* Guests */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-ink">
              {t("guests")}
            </span>
            <span className="text-xs text-neutral-500 ml-1.5">
              {t("guestAgeNote")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              disabled={guestCount <= 1}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-ink hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
              aria-label={t("decreaseGuests")}
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="w-6 text-center font-medium text-ink">
              {guestCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setGuestCount(
                  Math.min(property.personCapacity || 10, guestCount + 1),
                )
              }
              disabled={guestCount >= (property.personCapacity || 10)}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-ink hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-300 transition-colors"
              aria-label={t("increaseGuests")}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {property.personCapacity && (
          <div className="text-xs text-neutral-500 mt-1">
            {t("maximumGuests", { count: property.personCapacity })}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="mt-3 text-xs text-neutral-600">
        {t("minimumStay", {
          count: checkInDate
            ? getMinimumStayForCheckIn()
            : calendarData.minimumStay,
        })}
      </div>
      {/* Status */}
      {pricingData.isLoading && (
        <div className="mt-3 text-xs text-neutral-600" role="status">
          {t("calculatingPrice")}
        </div>
      )}
      {pricingData.error && (
        <div className="mt-3 text-xs text-red-600">{pricingData.error}</div>
      )}

      {/* Totals + primary CTA */}
      {priced && (
        <>
          <div className="mt-4 pt-4 border-t border-neutral-200 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>
                {pricingData.nights === 1
                  ? t("nightCount", { count: pricingData.nights })
                  : t("nightCountPlural", { count: pricingData.nights })}
              </span>
              <span>
                {t("avg")} {formatPriceForDisplay(silqhausNightly, "THB")}
                {t("perNight")}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-ink mt-2">
              <span>{t("total")}</span>
              <span>{formatPriceForDisplay(silqhausTotal, "THB")}</span>
            </div>
          </div>

          <a
            href={silqhausBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center w-full h-12 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white hover:text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
            aria-label={t("bookOnSilqhaus")}
          >
            {t("bookNow")}
          </a>
        </>
      )}

      {/* Platform comparison */}
      {priced && otaOffers.length > 0 && (
        <div className="mt-5 pt-4 border-t border-neutral-200">
          <p className="text-sm font-semibold text-ink">
            {t("priceComparison")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {t("priceComparisonNote")}
          </p>

          <div className="mt-3">
            {/* Silqhaus Direct — the best-price row */}
            <div className="flex items-center gap-3 py-3 border-b border-neutral-100">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ink overflow-hidden relative shrink-0">
                <Image
                  src="/logos/silqhaus-logo-navigation.png"
                  alt=""
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-ink">
                  {t("silqhausDirect")}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-green-700">
                  {t("bestPrice")}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-sm font-semibold text-ink">
                  {formatPriceForDisplay(silqhausTotal, "THB")}
                </span>
                {pricingData.nights > 0 && (
                  <span className="block text-[11px] text-neutral-500">
                    {formatPriceForDisplay(silqhausNightly, "THB")}
                    {t("perNight")}
                  </span>
                )}
              </div>
            </div>

            {otaOffers.map((offer) => {
              const otaTotal = calculateOTAPrice(
                pricingData.totalPrice,
                offer.markup,
                extraGuestCost,
                property.cleaningFee || 0,
              );
              const diff = otaTotal - silqhausTotal;
              const otaNightly =
                pricingData.nights > 0
                  ? Math.round(otaTotal / pricingData.nights)
                  : 0;
              return (
                <a
                  key={offer.key}
                  href={offer.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={offer.ariaLabel}
                  className="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <span className="shrink-0">{offer.badge}</span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink">
                      {offer.name}
                    </span>
                    {diff > 0 && (
                      <span className="block text-[11px] font-medium text-red-600">
                        {t("moreExpensive", {
                          amount: `฿${diff.toLocaleString()}`,
                        })}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-sm font-semibold text-ink">
                      {formatPriceForDisplay(otaTotal, "THB")}
                    </span>
                    {pricingData.nights > 0 && (
                      <span className="block text-[11px] text-neutral-500">
                        {formatPriceForDisplay(otaNightly, "THB")}
                        {t("perNight")}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-white text-ink font-sans pt-14 md:pt-16 ${
        fullGalleryOpen ? "pointer-events-none" : ""
      }`}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-28 lg:pb-16">
        {/* Back */}
        <Link
          href="/our-property"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-ink hover:underline underline-offset-2"
          data-testid="button-back-to-explore"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t("backToExplore")}
        </Link>

        {/* Title */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[28px] font-semibold leading-snug text-ink">
              {title}
            </h1>
            <p className="mt-1 text-[15px] text-neutral-600 flex flex-wrap items-center gap-x-1.5">
              {rating && (
                <span className="inline-flex items-center gap-1 font-medium text-ink">
                  <Star
                    className="w-3.5 h-3.5 fill-current"
                    aria-hidden="true"
                  />
                  {rating}
                </span>
              )}
              {rating && location && <span aria-hidden="true">·</span>}
              {location && <span>{location}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ShareButton
              title={title}
              shareLabel={t("share")}
              copiedLabel={t("linkCopied")}
              ariaLabel={t("shareProperty")}
            />
            <PMSFavoriteButton
            listingId={String(property.id)}
            side="vacation"
            variant="detail"
            snapshot={{
              kind: "vacation",
              id: String(property.id),
              name: title,
              slug: createPropertySlug(property.name, property.id),
              city: property.city ?? null,
              state: property.state ?? null,
              imageUrl: property.images?.[0]?.url ?? null,
              bedroomsNumber: property.bedroomsNumber ?? null,
              bathroomsNumber: property.bathroomsNumber ?? null,
              personCapacity: property.personCapacity ?? null,
            }}
          />
          </div>
        </div>

        {/* Gallery */}
        {propertyPhotos.length > 0 && (
          <section className="mt-4">
            <GalleryCarousel
              theme="light"
              photos={propertyPhotos.map((p) => ({
                url: p.url,
                caption: p.caption ?? undefined,
              }))}
              propertyTitle={title}
              onImageClick={(index) => {
                setLightboxStartIndex(index);
                setLightboxOpen(true);
              }}
              onViewAll={() => setFullGalleryOpen(true)}
            />
          </section>
        )}

        {/* Body */}
        <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 lg:items-start">
          {/* Left column */}
          <div className="min-w-0">
            {/* Quick facts — editorial fact band: the values carry the line,
                icons live small inside the labels, thin column rules only
                when the row is complete on large screens. */}
            {factCells.length > 0 && (
              <section className="pb-8 border-b border-neutral-200">
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 ${
                    FACT_COLS[factCells.length] ?? "lg:grid-cols-5"
                  } gap-y-7`}
                >
                  {factCells.map((cell) => (
                    <div
                      key={cell.key}
                      className="pr-4 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-neutral-200 lg:[&:not(:first-child)]:pl-6"
                    >
                      <div className="text-[22px] font-semibold tracking-tight text-ink leading-none">
                        {cell.value}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-neutral-500">
                        <cell.icon
                          className="w-3.5 h-3.5 shrink-0"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        {cell.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* About */}
            {property.description && (
              <section className="py-8 border-b border-neutral-200">
                <h2 className="text-xl font-semibold normal-case tracking-normal text-ink mb-4">
                  {t("aboutThisProperty")}
                </h2>
                <ExpandableText
                  text={property.description}
                  showMoreLabel={t("showMore")}
                  showLessLabel={t("showLess")}
                />
              </section>
            )}

            {/* Booking conditions — cancellation policy + house rules */}
            <BookingConditions
              checkInTime={property.checkInTime}
              checkOutTime={property.checkOutTime}
              maxGuests={property.personCapacity}
              petsAllowed={(property.listingAmenities || []).some((a) =>
                /pets?\s+allowed/i.test(a.amenityName),
              )}
              cancellationPolicy={
                property.cancellationPolicy || (isGuesty ? "standard" : null)
              }
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
            />

            {/* Amenities */}
            {amenities.length > 0 && (
              <section className="py-8 border-b border-neutral-200">
                <h2 className="text-xl font-semibold normal-case tracking-normal text-ink mb-5">
                  {t("amenitiesAndFeatures")}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {visibleAmenities.map((amenity) => (
                    <li
                      key={amenity.id}
                      className="flex items-center gap-3 text-[15px] text-ink"
                    >
                      <Check
                        className="w-5 h-5 text-neutral-700 shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {amenity.amenityName}
                    </li>
                  ))}
                </ul>
                {amenities.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setAmenitiesExpanded((v) => !v)}
                    aria-expanded={amenitiesExpanded}
                    className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-lg border border-ink text-[15px] font-semibold text-ink hover:bg-neutral-50 transition-colors"
                  >
                    {amenitiesExpanded
                      ? t("showLessAmenities")
                      : t("showAllAmenities", { count: amenities.length })}
                  </button>
                )}
              </section>
            )}

            {/* Availability — the booking picker's calendar, browsable at
                full size. Shares the page's dates, so a range chosen here
                re-prices the booking card. */}
            {(calendarData.isLoading || calendarData.calendar.length > 0) && (
              <AvailabilityCalendar
                calendarData={calendarData.calendar}
                minimumStay={calendarData.minimumStay}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInChange={setCheckInDate}
                onCheckOutChange={setCheckOutDate}
                applyMarkup={!isGuesty}
                markupSource={source}
                isLoading={calendarData.isLoading}
              />
            )}

          </div>

          {/* Right column — desktop booking card */}
          {bookable && (
            <div className="hidden lg:block lg:sticky lg:top-24">
              <section className="rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-5">
                {renderBookingPanel()}
              </section>
              {supportLinks}
            </div>
          )}
        </div>

        {/* Below the two-column grid the booking card stops following:
            these sections span the full content width. */}
        {/* Location & neighborhood */}
        <section className="py-8 border-b border-neutral-200">
          <PropertyMap
            theme="light"
            lat={property.lat || 7.8804}
            lng={property.lng || 98.3923}
            propertyName={title}
          />
          {(() => {
            const areaKey = areaKeyForCity(property.city);
            const areaText =
              property.neighborhoodOverview ||
              (areaKey ? t(`neighborhoods.${areaKey}`) : null);
            if (!areaText && !areaKey) return null;
            return (
              <>
                {areaText && (
                  <div className="mt-5 max-w-[75ch]">
                    {location && (
                      <p className="text-[15px] font-semibold text-ink">
                        {location}
                      </p>
                    )}
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink/90 whitespace-pre-line">
                      {areaText}
                    </p>
                  </div>
                )}
                {areaKey && (
                  <div className="mt-6">
                    <p className="text-[15px] font-semibold text-ink">
                      {t("attractionsTitle")}
                    </p>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(["one", "two", "three"] as const).map((slot) => (
                        <div
                          key={slot}
                          className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3"
                        >
                          <span className="w-9 h-9 rounded-full bg-neutral-100 grid place-items-center shrink-0">
                            <MapPin
                              className="w-[18px] h-[18px] text-ink"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-ink leading-snug">
                              {t(`attractions.${areaKey}.${slot}.name`)}
                            </span>
                            <span className="block text-xs text-neutral-500 mt-0.5">
                              {t(`attractions.${areaKey}.${slot}.desc`)}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </section>

        {/* Reviews — Hostaway's own feed, or Guesty's synced channel
            reviews. Renders nothing when a listing has no reviews yet. */}
        <PropertyReviews
          propertyId={propertyId}
          source={source}
          property={property}
          averageReviewRating={property.averageReviewRating}
        />

        {/* Nearby */}
        {property.city && (
          <NearbyListingsCarousel
            theme="light"
            city={property.city}
            currentPropertyId={property.id}
            currentSource={isGuesty ? "guesty" : "hostaway"}
          />
        )}
      </main>

      {/* Mobile booking bar */}
      {bookable && !mobileBookingOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              {priced ? (
                <>
                  <span className="block text-[15px] font-semibold text-ink truncate">
                    ฿{silqhausTotal.toLocaleString()}
                  </span>
                  <span className="block text-xs text-neutral-600">
                    {t("forNights", { count: pricingData.nights })}
                  </span>
                </>
              ) : (
                <span className="text-sm text-neutral-600">
                  {t("addDatesForPrices")}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileBookingOpen(true)}
              className="shrink-0 inline-flex items-center justify-center h-12 px-6 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
            >
              {priced ? t("bookNow") : t("checkAvailability")}
            </button>
          </div>
        </div>
      )}

      {/* Mobile booking sheet */}
      {bookable && mobileBookingOpen && (
        <div className="lg:hidden fixed inset-0 z-[75]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileBookingOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("bookYourStay")}
            className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-4 fade-in-0 duration-200 motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold normal-case tracking-normal text-ink">
                {t("bookYourStay")}
              </h2>
              <button
                type="button"
                onClick={() => setMobileBookingOpen(false)}
                className="w-9 h-9 rounded-full grid place-items-center text-ink hover:bg-neutral-100"
                aria-label={t("close")}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {renderBookingPanel({ inlineCalendar: true })}
            {supportLinks}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          propertyName={title}
        />
      )}

      {/* Full Screen Gallery Modal */}
      {fullGalleryOpen && (
        <FullScreenGallery
          images={lightboxImages}
          isOpen={fullGalleryOpen}
          onClose={() => setFullGalleryOpen(false)}
          onImageClick={(index: number) => {
            setFullGalleryOpen(false);
            setLightboxStartIndex(index);
            setLightboxOpen(true);
          }}
          propertyName={title}
        />
      )}
    </div>
  );
}
