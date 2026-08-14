"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export interface PropertyListItem {
  id: number | string;
  source?: "hostaway" | "guesty";
  name?: string;
  city?: string;
  state?: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  price?: number;
  currencyCode?: string;
  /** Present on both sources at runtime (Guesty normalizes them, Hostaway
   *  passes them through raw) — declared so the map can read them typed. */
  lat?: number;
  lng?: number;
  listingImages?: Array<{ url: string; caption?: string | null }>;
  [key: string]: unknown;
}

interface PropertyFilters {
  bedrooms: string;
  propertyType: string;
  guests: string;
  amenities: string[];
  location: string;
}

function readUrlParams() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search);
}

export function usePropertyFilters() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState<PropertyFilters>(() => {
    const query = readUrlParams();
    if (!query)
      return {
        bedrooms: "",
        propertyType: "",
        guests: "",
        amenities: [],
        location: "",
      };
    const initialFilters: PropertyFilters = {
      bedrooms: "",
      propertyType: "",
      guests: "",
      amenities: [],
      location: "",
    };
    for (const key of Object.keys(
      initialFilters,
    ) as (keyof PropertyFilters)[]) {
      const value = query.getAll(key);
      if (value.length === 1) (initialFilters[key] as string) = value[0];
      else if (value.length > 1) (initialFilters[key] as string[]) = value;
    }
    return initialFilters;
  });

  const [searchDates, setSearchDates] = React.useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>(() => {
    const query = readUrlParams();
    if (!query) return { checkIn: null, checkOut: null };
    const checkInStr = query.get("checkIn");
    const checkOutStr = query.get("checkOut");
    if (checkInStr && checkOutStr) {
      const checkIn = new Date(checkInStr);
      const checkOut = new Date(checkOutStr);
      if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
        return { checkIn, checkOut };
      }
    }
    return { checkIn: null, checkOut: null };
  });

  const [showAvailableOnly, setShowAvailableOnly] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 100000,
  ]);
  const [priceFilterActive, setPriceFilterActive] = React.useState(false);

  const [minBedrooms, setMinBedrooms] = React.useState<number>(() => {
    const query = readUrlParams();
    if (!query) return 1;
    const b = parseInt(query.get("bedrooms") || "", 10);
    return !isNaN(b) && b > 1 ? b : 1;
  });

  const [bedroomsFilterActive, setBedroomsFilterActive] =
    React.useState<boolean>(() => {
      const query = readUrlParams();
      if (!query) return false;
      const b = parseInt(query.get("bedrooms") || "", 10);
      return !isNaN(b) && b > 1;
    });

  const [minGuests, setMinGuests] = React.useState<number>(() => {
    const query = readUrlParams();
    if (!query) return 1;
    const g = parseInt(query.get("guests") || "", 10);
    return !isNaN(g) && g > 1 ? g : 1;
  });

  // The URL is the source of truth for arriving searches. The useState
  // initializers read window.location, which is stale during client-side
  // navigations (Next renders the new route before it pushes history), so
  // re-sync whenever the router's own search params change.
  React.useEffect(() => {
    const location = searchParams.get("location") ?? "";
    const guests = searchParams.get("guests") ?? "";
    const bedrooms = searchParams.get("bedrooms") ?? "";
    setFilters((prev) => ({ ...prev, location, guests, bedrooms }));

    const g = parseInt(guests, 10);
    setMinGuests(!isNaN(g) && g > 1 ? g : 1);
    const b = parseInt(bedrooms, 10);
    setMinBedrooms(!isNaN(b) && b > 1 ? b : 1);
    setBedroomsFilterActive(!isNaN(b) && b > 1);

    const checkInStr = searchParams.get("checkIn");
    const checkOutStr = searchParams.get("checkOut");
    if (checkInStr && checkOutStr) {
      const checkIn = new Date(checkInStr);
      const checkOut = new Date(checkOutStr);
      if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
        setSearchDates({ checkIn, checkOut });
        return;
      }
    }
    setSearchDates({ checkIn: null, checkOut: null });
  }, [searchParams]);

  const {
    data: hostawayListings,
    isLoading: hostawayLoading,
    isError: hostawayError,
  } = useQuery({
    queryKey: ["hostaway", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/hostaway/listings");
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });

  const {
    data: guestyListings,
    isLoading: guestyLoading,
    isError: guestyError,
  } = useQuery({
    queryKey: ["guesty", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/guesty/listings");
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });

  const allProperties = React.useMemo<PropertyListItem[]>(() => {
    const ha: PropertyListItem[] = Array.isArray(hostawayListings)
      ? hostawayListings
      : [];
    const gu: PropertyListItem[] = Array.isArray(guestyListings)
      ? guestyListings
      : [];
    const merged: PropertyListItem[] = [...ha, ...gu];
    const seen = new Set<string>();
    const deduped: PropertyListItem[] = [];
    for (const p of merged) {
      const src = p?.source === "guesty" ? "gu" : "ha";
      const key = `${src}:${p?.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(p);
    }
    return deduped;
  }, [hostawayListings, guestyListings]);

  // Treat as loading only while initial data is still being fetched.
  const isLoading =
    (hostawayLoading && !hostawayListings) ||
    (guestyLoading && !guestyListings);
  // Only flag an error if BOTH sources failed (so partial failure still
  // shows the other source's listings).
  const isError = hostawayError && guestyError;

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const { data: hostawayCalendar, isFetching: hostawayFetchingCal } = useQuery({
    queryKey: [
      "batchCalendar",
      "hostaway",
      searchDates.checkIn?.toISOString(),
      searchDates.checkOut?.toISOString(),
    ],
    queryFn: async () => {
      const ids = ((hostawayListings ?? []) as PropertyListItem[])
        .map((p) => p.id)
        .join(",");
      if (!ids) return {} as Record<string, any>;
      const res = await fetch(
        `/api/hostaway/batch-calendar?listingIds=${ids}&startDate=${formatDate(searchDates.checkIn!)}&endDate=${formatDate(searchDates.checkOut!)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch pricing");
      return res.json();
    },
    enabled:
      !!searchDates.checkIn &&
      !!searchDates.checkOut &&
      !!hostawayListings?.length,
  });

  const { data: guestyCalendar, isFetching: guestyFetchingCal } = useQuery({
    queryKey: [
      "batchCalendar",
      "guesty",
      searchDates.checkIn?.toISOString(),
      searchDates.checkOut?.toISOString(),
    ],
    queryFn: async () => {
      const ids = ((guestyListings ?? []) as PropertyListItem[])
        .map((p) => p.id)
        .join(",");
      if (!ids) return {} as Record<string, any>;
      try {
        const res = await fetch(
          `/api/guesty/batch-calendar?listingIds=${ids}&startDate=${formatDate(searchDates.checkIn!)}&endDate=${formatDate(searchDates.checkOut!)}`,
        );
        if (!res.ok) return {} as Record<string, any>;
        return res.json();
      } catch {
        return {} as Record<string, any>;
      }
    },
    enabled:
      !!searchDates.checkIn &&
      !!searchDates.checkOut &&
      !!guestyListings?.length,
  });

  const calendarData = React.useMemo(() => {
    const merged: Record<string, any> = {};
    if (hostawayCalendar)
      for (const [k, v] of Object.entries(hostawayCalendar)) merged[k] = v;
    if (guestyCalendar)
      for (const [k, v] of Object.entries(guestyCalendar)) merged[k] = v;
    return merged;
  }, [hostawayCalendar, guestyCalendar]);

  const isLoadingPrices = hostawayFetchingCal || guestyFetchingCal;

  const maxBedrooms = React.useMemo(() => {
    if (!allProperties?.length) return 10;
    return Math.max(...allProperties.map((p) => p.bedroomsNumber || 1));
  }, [allProperties]);

  const updateFilter = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchDates = (searchFilters: {
    location: string;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
  }) => {
    setSearchDates({
      checkIn: searchFilters.checkIn,
      checkOut: searchFilters.checkOut,
    });
    updateFilter("location", searchFilters.location || "");
    setMinGuests(searchFilters.guests);

    const params = new URLSearchParams();
    if (searchFilters.location) params.set("location", searchFilters.location);
    if (searchFilters.checkIn)
      params.set("checkIn", formatDate(searchFilters.checkIn));
    if (searchFilters.checkOut)
      params.set("checkOut", formatDate(searchFilters.checkOut));
    if (searchFilters.guests > 1)
      params.set("guests", String(searchFilters.guests));

    const qs = params.toString();
    const base = window.location.pathname;
    window.history.replaceState(null, "", qs ? `${base}?${qs}` : base);
  };

  const handleClearAllFilters = () => {
    setSearchDates({ checkIn: null, checkOut: null });
    setShowAvailableOnly(false);
    setMinGuests(1);
    setPriceRange([0, 100000]);
    setPriceFilterActive(false);
    setMinBedrooms(1);
    setBedroomsFilterActive(false);
    setFilters({
      bedrooms: "",
      propertyType: "",
      guests: "",
      amenities: [],
      location: "",
    });
    window.history.replaceState(null, "", window.location.pathname);
  };

  const filteredProperties = React.useMemo(() => {
    return (allProperties ?? []).filter((property) => {
      if (
        filters.bedrooms &&
        (property.bedroomsNumber || 0) < parseInt(filters.bedrooms)
      )
        return false;

      if (bedroomsFilterActive && (property.bedroomsNumber ?? 0) < minBedrooms)
        return false;

      if (minGuests > 1 && (property.personCapacity ?? 0) < minGuests)
        return false;

      if (filters.location) {
        const loc = filters.location.toLowerCase();
        const stateContains = property.state?.toLowerCase().includes(loc);
        const cityContains = property.city?.toLowerCase().includes(loc);
        if (!stateContains && !cityContains) return false;
      }

      if (priceFilterActive && calendarData) {
        const pricing = calendarData[property.id];
        if (pricing) {
          const avgPrice =
            pricing.nights > 0
              ? pricing.totalPrice / pricing.nights
              : pricing.averageNightlyRate || 0;
          if (avgPrice < priceRange[0] || avgPrice > priceRange[1])
            return false;
        }
      }

      return true;
    });
  }, [
    allProperties,
    filters,
    priceFilterActive,
    priceRange,
    calendarData,
    bedroomsFilterActive,
    minBedrooms,
    minGuests,
  ]);

  return {
    filters,
    searchDates,
    showAvailableOnly,
    setShowAvailableOnly,
    priceRange,
    setPriceRange,
    priceFilterActive,
    setPriceFilterActive,
    minBedrooms,
    setMinBedrooms,
    bedroomsFilterActive,
    setBedroomsFilterActive,
    minGuests,
    setMinGuests,
    allProperties,
    isLoading,
    isError,
    calendarData,
    isLoadingPrices,
    maxBedrooms,
    filteredProperties,
    handleSearchDates,
    handleClearAllFilters,
    updateFilter,
    formatDate,
  };
}
