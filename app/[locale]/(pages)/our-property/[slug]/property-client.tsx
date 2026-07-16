"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  ArrowLeft,
  Waves,
  Mountain,
  Sparkles,
  Bed,
  Bath,
  Users,
  Building2,
  ChevronUp,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import { SiAirbnb } from "react-icons/si";
import dynamic from "next/dynamic";
import Lightbox from "@/components/lightbox";
import FullScreenGallery from "@/components/full-screen-gallery";
import { GalleryCarousel } from "@/components/gallery-carousel";
import { DateRangePicker } from "@/components/date-range-picker";
import { useTranslations, useLocale } from "next-intl";
import { PropertyReviews } from "@/components/property-reviews";

const PropertyMap = dynamic(() => import("@/components/property-map"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-lg" />,
});

const NearbyListingsCarousel = dynamic(
  () => import("@/components/nearby-listings-carousel"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-800 animate-pulse rounded-lg" />
    ),
  },
);
import { fetchListingById } from "@/lib/api/hostaway";
import { createPropertySlug } from "@/lib/slugify";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import {
  OTA_MARKUPS,
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
}

interface PropertyApiResult {
  id: number | string;
  name: string;
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
}

interface HostawayApiResponse {
  result: PropertyApiResult;
}

function normalizeProperty(data: HostawayApiResponse): Property {
  const r = data.result;
  return {
    id: r.id,
    name: r.name,
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

  useEffect(() => {
    if (property) {
      sessionStorage.setItem("selectedProperty", JSON.stringify(property));
    }
  }, [property]);

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

  // ------------------------------------
  // Image handling (JSON only)
  // ------------------------------------
  const propertyPhotos =
    property?.images && property.images.length > 0 ? property.images : [];

  const coverImage = propertyPhotos[0]?.url || "";
  const galleryImages = propertyPhotos.slice(1);

  const lightboxImages = propertyPhotos.map((img) => ({
    src: img.url,
    alt: img.caption
      ? `${property?.name || "Property"} - ${img.caption}`
      : property?.name || "Property",
  }));

  // ------------------------------------
  // Booking handler
  // ------------------------------------
  const handleBookProperty = () => {
    if (!property) return;

    // Use state variables instead of DOM lookups
    const checkin = checkInDate;
    const checkout = checkOutDate;
    const guests = "1"; // Default to 1 guest

    // Use pricingData if available, otherwise calculate
    let nights = pricingData.nights;
    let totalAmount = pricingData.totalPrice;

    if (!nights && checkin && checkout) {
      // Fallback calculation using local date parsing
      const [inYear, inMonth, inDay] = checkin.split("-").map(Number);
      const [outYear, outMonth, outDay] = checkout.split("-").map(Number);
      const checkinDate = new Date(inYear, inMonth - 1, inDay);
      const checkoutDate = new Date(outYear, outMonth - 1, outDay);
      nights = Math.max(
        1,
        Math.floor(
          (checkoutDate.getTime() - checkinDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );
      totalAmount = property.price * nights;
    } else if (!nights) {
      nights = 1;
      totalAmount = property.price;
    }

    // Apply Silqhaus pricing: source-based markup (Hostaway 10%, Guesty 10%) + extra guest fee + cleaning fee
    totalAmount = calculateSilqhausPrice(
      totalAmount,
      extraGuestCost,
      property.cleaningFee || 0,
      source,
    );

    const pricePerNight = pricingData.averageNightlyRate || property.price;

    sessionStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        propertyId: property.id,
        propertyName: property.name,
        checkin: checkin || "Not selected",
        checkout: checkout || "Not selected",
        guests: `${guests} guest${guests !== "1" ? "s" : ""}`,
        nights,
        pricePerNight,
        totalAmount,
        total: `${property.currencyCode} ${totalAmount.toLocaleString()}`,
      }),
    );

    router.push("/checkout");
  };

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    router.push("/our-property");
    return null;
  }

  return (
    <div
      className={`min-h-screen font-poppins text-white bg-[#000000] ${
        fullGalleryOpen ? "pointer-events-none" : ""
      }`}
    >
      {/* Navigation with dark theme */}
      <div className="bg-[var(--ink-detail)]"></div>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/our-property")}
          variant="outline"
          className="border-[var(--cocoa)] text-[var(--cocoa)] hover:bg-[var(--cocoa)] hover:text-white flex items-center gap-2 mb-6 focus:ring-[var(--cocoa)]"
          data-testid="button-back-to-explore"
        >
          <ArrowLeft size={16} />
          {t("backToExplore")}
        </Button>

        {/* Property Details */}
        <section className="mt-20">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-white font-gilroy">
              {property.name}
            </h1>
            <PMSFavoriteButton
              listingId={String(property.id)}
              side="vacation"
              variant="detail"
              snapshot={{
                kind: "vacation",
                id: String(property.id),
                name: property.name,
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

          <div className="text-white/80 mb-4 flex items-center gap-2 flex-wrap">
            <span>
              {property.city}, {property.state}
            </span>
          </div>

          <div className="border-t border-[var(--stone)] pt-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-poppins font-medium text-white/90">
              {/* Accommodates */}
              <span
                className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                aria-label="Accommodates 12 guests"
              >
                <Users
                  className="w-4 h-4 text-current flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span>
                  {t("maxGuests", { count: property.personCapacity ?? 0 })}
                </span>
              </span>

              <span className="text-white/40 select-none">•</span>

              {/* Bathrooms */}
              <span
                className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                aria-label="5 Private Bathrooms"
              >
                <Bath
                  className="w-4 h-4 text-current flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span>
                  {t("bathrooms", { count: property.bathroomsNumber ?? 0 })}
                </span>
              </span>

              <span className="text-white/40 select-none">•</span>

              {/* Bedrooms */}
              <span
                className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                aria-label="6 Bedrooms"
              >
                <Bed
                  className="w-4 h-4 text-current flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span>
                  {t("bedrooms", { count: property.bedroomsNumber ?? 0 })}
                </span>
              </span>

              <span className="text-white/40 select-none">•</span>

              {/* Beds */}
              {/* <span
                    className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                    aria-label="7 Beds"
                  >
                    <Sofa
                      className="w-4 h-4 text-current flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span>7 Beds</span>
                  </span> */}

              {/* <span className="text-white/40 select-none">•</span> */}

              {/* Property Type */}
              <span
                className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                aria-label="Villa Property Type"
              >
                <Building2
                  className="w-4 h-4 text-current flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span>{property.roomType}</span>
              </span>

              {/* <span className="text-white/40 select-none">•</span> */}

              {/* Room Type */}
              {/* <span
                    className="flex items-center gap-1.5 hover:text-[#6e5d41] focus:text-[#6e5d41] transition-colors duration-200"
                    aria-label="Entire Home"
                  >
                    <Home
                      className="w-4 h-4 text-current flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span>Entire Home</span>
                  </span> */}
            </div>
          </div>
        </section>

        {/* Property Image Gallery - Hero Section with Carousel */}
        {propertyPhotos.length > 0 && (
          <section className="my-8">
            {/* Carousel state for navigating through image sets */}
            <GalleryCarousel
              photos={propertyPhotos.map((p) => ({
                url: p.url,
                caption: p.caption ?? undefined,
              }))}
              propertyTitle={property.name}
              onImageClick={(index) => {
                setLightboxStartIndex(index);
                setLightboxOpen(true);
              }}
              onViewAll={() => setFullGalleryOpen(true)}
            />
          </section>
        )}

        {/* Main Content Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
          {/* Left Column - Property Details */}
          <div className="space-y-8">
            {/* Description & Amenities */}
            <section>
              <h2 className="font-bold text-white mb-4 font-gilroy">
                {t("aboutThisProperty")}
              </h2>
              <div className="text-white/90 leading-snug space-y-4 whitespace-pre-line">
                <p>{property.description}</p>
              </div>
            </section>

            {/* Amenities & Features */}
            <section>
              <h2 className="text-[#e3e1d8] mb-8 font-gilroy text-2xl font-bold">
                {t("amenitiesAndFeatures")}
              </h2>

              {/* Compact Amenities Grid */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(property.listingAmenities || [])
                    .slice(0, 20)
                    .map((amenity) => {
                      const name = amenity.amenityName;

                      return (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-[#6e5d41] rounded-lg flex items-center justify-center flex-shrink-0">
                            <CircleCheck
                              className="w-4 h-4 text-white"
                              strokeWidth={1.5}
                            />
                          </div>

                          <span className="font-poppins text-white text-sm font-medium">
                            {name}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Property Highlights - COMMENTED OUT
              <div className="mt-8 p-6 bg-gradient-to-r from-[#ffffff]/20 to-[#6b5a20]/20 backdrop-blur-sm border border-[#ffffff]/30 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-[#ffffff] rounded-full flex items-center justify-center mx-auto">
                      <Mountain
                        className="w-6 h-6 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h4 className="text-white font-semibold font-poppins">
                      1,298 sqm
                    </h4>
                    <p className="text-white/70 text-sm font-poppins">
                      Expansive Land Size
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-[#ffffff] rounded-full flex items-center justify-center mx-auto">
                      <Sparkles
                        className="w-6 h-6 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h4 className="text-white font-semibold font-poppins">
                      Premium
                    </h4>
                    <p className="text-white/70 text-sm font-poppins">
                      Hardwood Furniture
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-[#ffffff] rounded-full flex items-center justify-center mx-auto">
                      <Waves className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-white font-semibold font-poppins">
                      Pool Access
                    </h4>
                    <p className="text-white/70 text-sm font-poppins">
                      From Master Bedroom
                    </p>
                  </div>
                </div>
              </div>
              */}
            </section>

            {!isGuesty && (
              <PropertyReviews
                propertyId={propertyId}
                property={property}
                averageReviewRating={property.averageReviewRating}
              />
            )}

            {/* Location & Map Section */}
            <PropertyMap
              lat={property.lat || 7.8804}
              lng={property.lng || 98.3923}
              propertyName={property.name}
              className="mb-8"
              overlayText="5 min to Layan Beach | Family Friendly Pool Villa"
            />

            {/* Nearby Listings Carousel */}
            {property.city && (
              <NearbyListingsCarousel
                city={property.city}
                currentPropertyId={property.id}
                currentSource={isGuesty ? "guesty" : "hostaway"}
                className="mb-8"
              />
            )}
          </div>

          {/* Right Column - Booking Calendar & OTA Platforms (Tablet/Desktop Only - md: and above) */}
          {(!isGuesty ||
            calendarData.isLoading ||
            calendarData.calendar.length > 0) && (
            <div className="hidden md:block md:sticky md:top-6 md:h-fit">
              <section className="bg-ink-2 rounded-2xl border border-line shadow-2xl shadow-black/40 overflow-hidden">
                <div className="bg-ink-2 p-5 border-b border-line">
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
                    onError={(error) =>
                      setPricingData((prev) => ({ ...prev, error }))
                    }
                  />

                  <div className="mt-2 text-xs text-gray-400 text-left">
                    {t("minimumStay", {
                      count: checkInDate
                        ? getMinimumStayForCheckIn()
                        : calendarData.minimumStay,
                    })}
                  </div>

                  <div className="mt-2 text-xs text-left text-white">
                    {t("monthlyPromoText")}{" "}
                    <Link
                      href={`/monthly-inquiry?property=${encodeURIComponent(property?.name || "")}`}
                      className="text-[#ffffff] hover:text-[#a3894a] underline transition-colors"
                    >
                      {t("monthlyPromoLink")}
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-white uppercase tracking-wide">
                          {t("guest")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {t("guestAgeNote")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount(Math.max(1, guestCount - 1))
                          }
                          disabled={guestCount <= 1}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={t("decreaseGuests")}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-medium text-white">
                          {guestCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount(
                              Math.min(
                                property?.personCapacity || 10,
                                guestCount + 1,
                              ),
                            )
                          }
                          disabled={
                            guestCount >= (property?.personCapacity || 10)
                          }
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={t("increaseGuests")}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {property?.personCapacity && (
                      <div className="text-xs text-gray-400 mt-1">
                        {t("maximumGuests", {
                          count: property.personCapacity ?? 0,
                        })}
                      </div>
                    )}
                  </div>

                  {pricingData.isLoading && (
                    <div className="mt-3 text-center text-xs text-gray-400">
                      {t("calculatingPrice")}
                    </div>
                  )}
                  {pricingData.error && (
                    <div className="mt-3 text-center text-xs text-red-400">
                      {pricingData.error}
                    </div>
                  )}
                  {pricingData.totalPrice > 0 && !pricingData.isLoading && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          {pricingData.nights === 1
                            ? t("nightCount", { count: pricingData.nights })
                            : t("nightCountPlural", {
                                count: pricingData.nights,
                              })}
                        </span>
                        <span>
                          {t("avg")}{" "}
                          {formatPriceForDisplay(
                            Math.round(
                              calculateSilqhausPrice(
                                pricingData.totalPrice,
                                extraGuestCost,
                                property?.cleaningFee || 0,
                                source,
                              ) / pricingData.nights,
                            ),
                            "THB",
                          )}
                          {t("perNight")}
                        </span>
                      </div>
                      {/*
                    {isGuesty &&
                      property?.cleaningFee != null &&
                      property.cleaningFee > 0 && (
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{t("cleaningFee")}</span>
                          <span>
                            {formatPriceForDisplay(
                              property.cleaningFee,
                              "THB",
                            )}
                          </span>
                        </div>
                      )}
                    */}
                      <div className="flex justify-between text-sm font-bold mt-1">
                        <span className="text-white">{t("total")}</span>
                        <span className="text-[#ffffff]">
                          {formatPriceForDisplay(
                            calculateSilqhausPrice(
                              pricingData.totalPrice,
                              extraGuestCost,
                              property?.cleaningFee || 0,
                              source,
                            ),
                            "THB",
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium mb-3 text-white">
                    {t("priceComparison")}
                  </p>
                  <div className="relative mb-3 rounded-lg border border-[#ffffff] bg-[#ffffff]/10 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffffff] opacity-60"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ffffff]"></span>
                      </span>
                      <p className="text-xs font-semibold text-[#ffffff]">
                        {t("priceComparisonNote")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Silqhaus Direct */}
                    <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black overflow-hidden relative">
                          <Image
                            src="/logos/silqhaus-logo-navigation.png"
                            alt="Silqhaus"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-white">
                            {t("silqhausDirect")}
                          </span>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-[10px] text-green-600 uppercase tracking-wide font-semibold">
                              {t("bestPrice")}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#ffffff]">
                              {formatPriceForDisplay(
                                calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                ),
                                "THB",
                              )}
                            </span>
                            {pricingData.nights > 0 && (
                              <div className="text-[10px] text-white/50">
                                {formatPriceForDisplay(
                                  Math.round(
                                    calculateSilqhausPrice(
                                      pricingData.totalPrice,
                                      extraGuestCost,
                                      property?.cleaningFee || 0,
                                      source,
                                    ) / pricingData.nights,
                                  ),
                                  "THB",
                                )}
                                {t("perNight")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {pricingData.totalPrice > 0 && (
                        <a
                          href={
                            isGuesty
                              ? `https://silqhaus.guestybookings.com/${locale}/properties/${property.id}?minOccupancy=${guestCount}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
                              : `https://silqhaus.holidayfuture.com/listings/${property.id}?start=${checkInDate}&end=${checkOutDate}&numberOfGuests=${guestCount}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-white text-ink text-xs font-semibold rounded-md text-center hover:bg-white/90 transition-colors block"
                          aria-label={t("bookOnSilqhaus")}
                        >
                          {t("bookNow")}
                        </a>
                      )}
                    </div>

                    {property.airbnbListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF5A5F]">
                            <SiAirbnb className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Airbnb
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  airbnbMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    airbnbMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        airbnbMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={
                              isGuesty
                                ? `${property.airbnbListingUrl}?guests=${guestCount}&adults=${guestCount}&check_in=${checkInDate}&check_out=${checkOutDate}`
                                : `${property.airbnbListingUrl}?guests=${guestCount}&adults=${guestCount}&check_in=${checkInDate}&check_out=${checkOutDate}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#FF5A5F] text-white text-xs font-medium rounded-md text-center hover:bg-[#e04e52] transition-colors block"
                            aria-label={t("bookOnAirbnb")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.bookingcomListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#003580]">
                            <span className="text-white font-bold text-[9px]">
                              B.com
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Booking.com
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  bookingMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    bookingMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        bookingMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={(() => {
                              const u = new URL(property.bookingcomListingUrl);
                              u.searchParams.set("checkin", checkInDate);
                              u.searchParams.set("checkout", checkOutDate);
                              u.searchParams.set("no_rooms", "1");
                              u.searchParams.set(
                                "req_adults",
                                String(guestCount),
                              );
                              return u.toString();
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#003580] text-white text-xs font-medium rounded-md text-center hover:bg-[#00296b] transition-colors block"
                            aria-label={t("bookOnBookingCom")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.vrboListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3B5998]">
                            <span className="text-white font-bold text-xs">
                              Vrbo
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Vrbo
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  vrboMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    vrboMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        vrboMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={`${
                              property.vrboListingUrl
                            }?startDate=${checkInDate}&endDate=${checkOutDate}&chkin=${checkInDate}&chkout=${checkOutDate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#3B5998] text-white text-xs font-medium rounded-md text-center hover:bg-[#2d4373] transition-colors block"
                            aria-label={t("bookOnVrbo")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.expediaListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFCC00]">
                            <span className="text-[#1A1A1A] font-bold text-xs">
                              Exp
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Expedia
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  expediaMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    expediaMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        expediaMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={property.expediaListingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#FFCC00] text-[#1A1A1A] text-xs font-medium rounded-md text-center hover:bg-[#e6b800] transition-colors block"
                            aria-label={t("bookOnExpedia")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.tripcomListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#287DFA]">
                            <span className="text-white font-bold text-[10px]">
                              Trip
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Trip.com
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  tripcomMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    tripcomMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        tripcomMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={`${property.tripcomListingUrl}?checkIn=${checkInDate}&checkOut=${checkOutDate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#287DFA] text-white text-xs font-medium rounded-md text-center hover:bg-[#1f6ad8] transition-colors block"
                            aria-label={t("bookOnTripcom")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* COMMENTED OUT: Original Reservation Form
          <div className="lg:sticky lg:top-6 lg:h-fit">
            <section className="bg-white text-[var(--ink-detail)] rounded-lg p-3 border border-[var(--ink-detail)] shadow-lg">
              <div className="mb-3">
                <p className="text-base font-bold">
                  {formatPriceForDisplay(property.priceBase || 0, "THB")}
                  <span className="text-xs font-normal ml-1">per night</span>
                </p>
              </div>

              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label
                      htmlFor="checkin"
                      className="block text-xs font-medium mb-0.5"
                    >
                      Check-in
                    </label>
                    <input
                      id="checkin"
                      type="date"
                      className="w-full p-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--cocoa)]"
                      data-testid="input-checkin"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout"
                      className="block text-xs font-medium mb-0.5"
                    >
                      Check-out
                    </label>
                    <input
                      id="checkout"
                      type="date"
                      className="w-full p-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--cocoa)]"
                      data-testid="input-checkout"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="guests"
                    className="block text-xs font-medium mb-0.5"
                  >
                    Guests
                  </label>
                  <select
                    id="guests"
                    className="w-full p-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[var(--cocoa)]"
                    data-testid="select-guests"
                  >
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="5">5 guests</option>
                    <option value="6">6 guests</option>
                    <option value="7">7 guests</option>
                    <option value="8">8 guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 mb-3 text-xs">
                <div className="flex justify-between">
                  <span>
                    {formatPriceForDisplay(property.priceBase || 0, "THB")} × 3
                    nights
                  </span>
                  <span>
                    {formatPriceForDisplay(
                      (property.priceBase || 0) * 3,
                      "THB",
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 font-bold text-xs">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>
                      {formatPriceForDisplay(
                        (property.priceBase || 0) * 3,
                        "THB",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookProperty}
                className="w-full bg-black text-white border border-black hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 py-2 text-xs rounded font-medium"
                data-testid="button-reserve"
              >
                Check Availability
              </Button>
            </section>
          </div>
          */}
        </div>
      </main>

      {/* Mobile Sticky Bottom Booking Panel (phones only, < 768px) */}
      {/* The entire panel slides up/down together with the tab at the top */}
      {(!isGuesty ||
        calendarData.isLoading ||
        calendarData.calendar.length > 0) && (
        <div
          className={`md:hidden fixed left-0 right-0 bottom-0 z-50 h-[90vh] transition-all duration-300 ease-in-out`}
          style={{
            transform: mobileBookingOpen
              ? "translateY(0)"
              : "translateY(calc(100% - 56px))",
          }}
        >
          {/* Slide-up Panel Container - Tab at top, content below */}
          <div
            className="bg-[#000000] border-t border-[#ffffff] h-full flex flex-col"
            id="mobile-booking-panel"
          >
            {/* Toggle Tab - At top of panel, slides with content */}
            <button
              onClick={() => setMobileBookingOpen(!mobileBookingOpen)}
              className="shrink-0 w-full bg-[#ffffff] text-white py-4 flex items-center justify-center gap-2 font-medium text-[14px] shadow-lg"
              aria-expanded={mobileBookingOpen}
              aria-controls="mobile-booking-content"
              aria-label={
                mobileBookingOpen
                  ? t("hideBookingOptions")
                  : t("checkPriceAndBookingOptions")
              }
            >
              {mobileBookingOpen ? (
                <>
                  <ChevronDown className="w-5 h-5" />
                  {t("hide")}
                </>
              ) : (
                <>
                  <ChevronUp className="w-5 h-5" />
                  {t("checkPriceComparison")}
                </>
              )}
            </button>

            {/* Scrollable Content Area */}
            <div
              className="flex-1 overflow-y-auto p-4"
              id="mobile-booking-content"
              aria-hidden={!mobileBookingOpen}
            >
              <section className="bg-ink-2 rounded-2xl border border-line shadow-2xl shadow-black/40 overflow-hidden">
                <div className="bg-ink-2 p-5 border-b border-line">
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
                    onError={(error) =>
                      setPricingData((prev) => ({ ...prev, error }))
                    }
                  />

                  <div className="mt-2 text-xs text-gray-400 text-left">
                    {t("minimumStay", {
                      count: checkInDate
                        ? getMinimumStayForCheckIn()
                        : calendarData.minimumStay,
                    })}
                  </div>

                  <div className="mt-2 text-xs text-left text-white">
                    {t("monthlyPromoText")}{" "}
                    <Link
                      href={`/monthly-inquiry?property=${encodeURIComponent(property?.name || "")}`}
                      className="text-[#ffffff] hover:text-[#a3894a] underline transition-colors"
                    >
                      {t("monthlyPromoLink")}
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-white uppercase tracking-wide">
                          {t("guest")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {t("guestAgeNote")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount(Math.max(1, guestCount - 1))
                          }
                          disabled={guestCount <= 1}
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={t("decreaseGuests")}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-medium text-white">
                          {guestCount}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount(
                              Math.min(
                                property?.personCapacity || 10,
                                guestCount + 1,
                              ),
                            )
                          }
                          disabled={
                            guestCount >= (property?.personCapacity || 10)
                          }
                          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-300 hover:border-[#ffffff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label={t("increaseGuests")}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {property?.personCapacity && (
                      <div className="text-xs text-gray-400 mt-1">
                        {t("maximumGuests", {
                          count: property.personCapacity ?? 0,
                        })}
                      </div>
                    )}
                  </div>

                  {pricingData.isLoading && (
                    <div className="mt-3 text-center text-xs text-gray-400">
                      {t("calculatingPrice")}
                    </div>
                  )}
                  {pricingData.error && (
                    <div className="mt-3 text-center text-xs text-red-400">
                      {pricingData.error}
                    </div>
                  )}
                  {pricingData.totalPrice > 0 && !pricingData.isLoading && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>
                          {pricingData.nights === 1
                            ? t("nightCount", { count: pricingData.nights })
                            : t("nightCountPlural", {
                                count: pricingData.nights,
                              })}
                        </span>
                        <span>
                          {t("avg")}{" "}
                          {formatPriceForDisplay(
                            Math.round(
                              calculateSilqhausPrice(
                                pricingData.totalPrice,
                                extraGuestCost,
                                property?.cleaningFee || 0,
                                source,
                              ) / pricingData.nights,
                            ),
                            "THB",
                          )}
                          {t("perNight")}
                        </span>
                      </div>
                      {/*
                    {isGuesty &&
                      property?.cleaningFee != null &&
                      property.cleaningFee > 0 && (
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{t("cleaningFee")}</span>
                          <span>
                            {formatPriceForDisplay(
                              property.cleaningFee,
                              "THB",
                            )}
                          </span>
                        </div>
                      )}
                    */}
                      <div className="flex justify-between text-sm font-bold mt-1">
                        <span className="text-white">{t("total")}</span>
                        <span className="text-[#ffffff]">
                          {formatPriceForDisplay(
                            calculateSilqhausPrice(
                              pricingData.totalPrice,
                              extraGuestCost,
                              property?.cleaningFee || 0,
                              source,
                            ),
                            "THB",
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium mb-3 text-white">
                    {t("priceComparison")}
                  </p>
                  <div className="relative mb-3 rounded-lg border border-[#ffffff] bg-[#ffffff]/10 px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffffff] opacity-60"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ffffff]"></span>
                      </span>
                      <p className="text-xs font-semibold text-[#ffffff]">
                        {t("priceComparisonNote")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Silqhaus Direct */}
                    <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black overflow-hidden relative">
                          <Image
                            src="/logos/silqhaus-logo-navigation.png"
                            alt="Silqhaus"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-white">
                            {t("silqhausDirect")}
                          </span>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-[10px] text-green-600 uppercase tracking-wide font-semibold">
                              {t("bestPrice")}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#ffffff]">
                              {formatPriceForDisplay(
                                calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                ),
                                "THB",
                              )}
                            </span>
                            {pricingData.nights > 0 && (
                              <div className="text-[10px] text-white/50">
                                {formatPriceForDisplay(
                                  Math.round(
                                    calculateSilqhausPrice(
                                      pricingData.totalPrice,
                                      extraGuestCost,
                                      property?.cleaningFee || 0,
                                      source,
                                    ) / pricingData.nights,
                                  ),
                                  "THB",
                                )}
                                {t("perNight")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {pricingData.totalPrice > 0 && (
                        <a
                          href={
                            isGuesty
                              ? `https://silqhaus.guestybookings.com/${locale}/properties/${property.id}?minOccupancy=${guestCount}&checkIn=${checkInDate}&checkOut=${checkOutDate}`
                              : `https://silqhaus.holidayfuture.com/listings/${property.id}?start=${checkInDate}&end=${checkOutDate}&numberOfGuests=${guestCount}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-white text-ink text-xs font-semibold rounded-md text-center hover:bg-white/90 transition-colors block"
                          aria-label={t("bookOnSilqhaus")}
                        >
                          {t("bookNow")}
                        </a>
                      )}
                    </div>

                    {property.airbnbListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF5A5F]">
                            <SiAirbnb className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Airbnb
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  airbnbMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    airbnbMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        airbnbMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={
                              isGuesty
                                ? `${property.airbnbListingUrl}?guests=${guestCount}&adults=${guestCount}&check_in=${checkInDate}&check_out=${checkOutDate}`
                                : `${property.airbnbListingUrl}?guests=${guestCount}&adults=${guestCount}&check_in=${checkInDate}&check_out=${checkOutDate}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#FF5A5F] text-white text-xs font-medium rounded-md text-center hover:bg-[#e04e52] transition-colors block"
                            aria-label={t("bookOnAirbnb")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.bookingcomListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#003580]">
                            <span className="text-white font-bold text-[9px]">
                              B.com
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Booking.com
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  bookingMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    bookingMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        bookingMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={(() => {
                              const u = new URL(property.bookingcomListingUrl);
                              u.searchParams.set("checkin", checkInDate);
                              u.searchParams.set("checkout", checkOutDate);
                              u.searchParams.set("no_rooms", "1");
                              u.searchParams.set(
                                "req_adults",
                                String(guestCount),
                              );
                              return u.toString();
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#003580] text-white text-xs font-medium rounded-md text-center hover:bg-[#00296b] transition-colors block"
                            aria-label={t("bookOnBookingCom")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.vrboListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3B5998]">
                            <span className="text-white font-bold text-xs">
                              Vrbo
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Vrbo
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  vrboMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    vrboMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        vrboMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={`${
                              property.vrboListingUrl
                            }?startDate=${checkInDate}&endDate=${checkOutDate}&chkin=${checkInDate}&chkout=${checkOutDate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#3B5998] text-white text-xs font-medium rounded-md text-center hover:bg-[#2d4373] transition-colors block"
                            aria-label={t("bookOnVrbo")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.expediaListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFCC00]">
                            <span className="text-[#1A1A1A] font-bold text-xs">
                              Exp
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Expedia
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  expediaMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    expediaMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        expediaMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={property.expediaListingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#FFCC00] text-[#1A1A1A] text-xs font-medium rounded-md text-center hover:bg-[#e6b800] transition-colors block"
                            aria-label={t("bookOnExpedia")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}

                    {property.tripcomListingUrl && (
                      <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-line">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#287DFA]">
                            <span className="text-white font-bold text-[10px]">
                              Trip
                            </span>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-white">
                              Trip.com
                            </span>
                            {pricingData.totalPrice > 0 &&
                              (() => {
                                const silqhausTotal = calculateSilqhausPrice(
                                  pricingData.totalPrice,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                  source,
                                );
                                const otaTotal = calculateOTAPrice(
                                  pricingData.totalPrice,
                                  tripcomMarkup,
                                  extraGuestCost,
                                  property?.cleaningFee || 0,
                                );
                                const diff = otaTotal - silqhausTotal;
                                return diff > 0 ? (
                                  <div className="text-[10px] text-red-500 uppercase tracking-wide font-medium">
                                    {t("moreExpensive", {
                                      amount: formatPriceForDisplay(
                                        diff,
                                        "THB",
                                      ),
                                    })}
                                  </div>
                                ) : null;
                              })()}
                          </div>
                          {pricingData.totalPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#ffffff]">
                                {formatPriceForDisplay(
                                  calculateOTAPrice(
                                    pricingData.totalPrice,
                                    tripcomMarkup,
                                    extraGuestCost,
                                    property?.cleaningFee || 0,
                                  ),
                                  "THB",
                                )}
                              </span>
                              {pricingData.nights > 0 && (
                                <div className="text-[10px] text-white/50">
                                  {formatPriceForDisplay(
                                    Math.round(
                                      calculateOTAPrice(
                                        pricingData.totalPrice,
                                        tripcomMarkup,
                                        extraGuestCost,
                                        property?.cleaningFee || 0,
                                      ) / pricingData.nights,
                                    ),
                                    "THB",
                                  )}
                                  {t("perNight")}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {pricingData.totalPrice > 0 && (
                          <a
                            href={property.tripcomListingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-[#287DFA] text-white text-xs font-medium rounded-md text-center hover:bg-[#1f6ad8] transition-colors block"
                            aria-label={t("bookOnTripcom")}
                          >
                            {t("bookNow")}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
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
          propertyName={property.name}
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
          propertyName={property.name}
        />
      )}
    </div>
  );
}
