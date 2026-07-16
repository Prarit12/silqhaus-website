"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Bed, Bath, Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";
import { formatPMSPrice, getPMSCoverImage } from "@/lib/api/silqhaus-pms";

type IconType = ReturnType<typeof L.divIcon>;

interface PMSListingsMapProps {
  listings: PMSListing[];
  basePath: "properties-for-rent" | "properties-for-sale";
  activeId: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
}

interface MarkerEntry {
  marker: L.Marker;
  lat: number;
  lng: number;
  path: string;
}

interface PreviewPosition {
  x: number;
  y: number;
}

const THAILAND_CENTER: [number, number] = [13.7563, 100.5018];

function buildIdleIcon(): IconType {
  return L.divIcon({
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:#ffffff;color:#fff;border-radius:9999px;box-shadow:0 4px 10px rgba(0,0,0,0.45);border:2px solid #fff;transition:transform .2s ease;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    className: "silq-marker silq-marker-idle",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

function buildActiveIcon(): IconType {
  return L.divIcon({
    html: `
      <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:#c9a14a;color:#000;border-radius:9999px;box-shadow:0 6px 18px rgba(201,161,74,0.55), 0 0 0 6px rgba(201,161,74,0.2);border:3px solid #fff;transform:translateY(-4px);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    className: "silq-marker silq-marker-active",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
}

interface MapPreviewCardProps {
  listing: PMSListing;
  basePath: "properties-for-rent" | "properties-for-sale";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function MapPreviewCard({
  listing,
  basePath,
  onMouseEnter,
  onMouseLeave,
}: MapPreviewCardProps) {
  const tCard = useTranslations("pmsListingCard");
  const cover = getPMSCoverImage(listing);
  const price = formatPMSPrice(listing, tCard("perMonth"));
  const location = [listing.city, listing.state].filter(Boolean).join(", ");

  const facts: { Icon: typeof Bed; value: string }[] = [];
  if (listing.bedrooms != null) {
    facts.push({ Icon: Bed, value: String(listing.bedrooms) });
  }
  if (listing.bathrooms != null) {
    facts.push({ Icon: Bath, value: String(listing.bathrooms) });
  }
  if (listing.areaSqm != null) {
    facts.push({
      Icon: Maximize2,
      value: `${listing.areaSqm}${tCard("areaUnit")}`,
    });
  }

  return (
    <Link
      href={`/${basePath}/${listing.slug}`}
      className="block w-[240px] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.55)] no-underline"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={`pms-listings-map-preview-${listing.id}`}
    >
      <div className="relative w-full aspect-[16/10] bg-[#111]">
        <Image
          src={cover}
          alt={listing.title}
          fill
          sizes="240px"
          className="object-cover"
        />
      </div>
      <div className="px-3 py-3 font-poppins">
        {location && (
          <p className="text-[#aaa] text-[10px] uppercase tracking-wide mb-1">
            {location}
          </p>
        )}
        <h3 className="text-white text-[13px] font-bold leading-tight line-clamp-2 mb-2">
          {listing.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          {price ? (
            <span className="text-white text-[12px] font-bold">{price}</span>
          ) : (
            <span />
          )}
          {facts.length > 0 && (
            <div className="flex items-center gap-2 text-[#aaa]">
              {facts.map(({ Icon, value }, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <Icon size={10} className="text-[#ffffff]" />
                  <span className="text-[11px]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PMSListingsMap({
  listings,
  basePath,
  activeId,
  onActivate,
  onDeactivate,
}: PMSListingsMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const iconsRef = useRef<{ idle: IconType; active: IconType } | null>(null);
  const lastFitKeyRef = useRef<string>("");
  const [previewPos, setPreviewPos] = useState<PreviewPosition | null>(null);

  const activeListing = useMemo(
    () =>
      activeId
        ? (listings.find(
            (l) =>
              l.id === activeId &&
              typeof l.latitude === "number" &&
              typeof l.longitude === "number",
          ) ?? null)
        : null,
    [activeId, listings],
  );

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(THAILAND_CENTER, 6);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      //"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      },
    ).addTo(map);

    iconsRef.current = {
      idle: buildIdleIcon(),
      active: buildActiveIcon(),
    };

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      iconsRef.current = null;
      lastFitKeyRef.current = "";
    };
  }, []);

  // Sync markers when listings change
  useEffect(() => {
    const map = mapRef.current;
    const icons = iconsRef.current;
    if (!map || !icons) return;

    const geocoded = listings.filter(
      (l): l is PMSListing & { latitude: number; longitude: number } =>
        typeof l.latitude === "number" && typeof l.longitude === "number",
    );

    const nextIds = new Set(geocoded.map((l) => l.id));

    // Remove stale markers
    for (const [id, entry] of markersRef.current.entries()) {
      if (!nextIds.has(id)) {
        entry.marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Add or refresh markers
    for (const listing of geocoded) {
      const lat = listing.latitude;
      const lng = listing.longitude;
      const path = `/${basePath}/${listing.slug}`;
      const existing = markersRef.current.get(listing.id);

      if (existing) {
        if (existing.lat !== lat || existing.lng !== lng) {
          existing.marker.setLatLng([lat, lng]);
          existing.lat = lat;
          existing.lng = lng;
        }
        existing.path = path;
        continue;
      }

      const listingId = listing.id;
      const marker = L.marker([lat, lng], {
        icon: icons.idle,
        riseOnHover: true,
      });
      marker.on("mouseover", () => onActivate(listingId));
      marker.on("mouseout", () => onDeactivate());
      marker.on("click", () => {
        const entry = markersRef.current.get(listingId);
        if (entry) {
          router.push(entry.path);
        }
      });
      marker.addTo(map);
      markersRef.current.set(listingId, { marker, lat, lng, path });
    }

    // Fit bounds when the geocoded id set or any of their coordinates change
    const fitKey = geocoded
      .map((l) => `${l.id}@${l.latitude.toFixed(5)},${l.longitude.toFixed(5)}`)
      .sort()
      .join("|");
    if (fitKey && fitKey !== lastFitKeyRef.current) {
      lastFitKeyRef.current = fitKey;
      if (geocoded.length === 1) {
        const only = geocoded[0];
        map.setView([only.latitude, only.longitude], 13);
      } else {
        const bounds = L.latLngBounds(
          geocoded.map((l) => [l.latitude, l.longitude] as [number, number]),
        );
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [listings, basePath, onActivate, onDeactivate, router]);

  // Sync active marker style + pan + preview position
  useEffect(() => {
    const map = mapRef.current;
    const icons = iconsRef.current;
    if (!map || !icons) return;

    for (const [id, entry] of markersRef.current.entries()) {
      if (id === activeId) {
        entry.marker.setIcon(icons.active);
        entry.marker.setZIndexOffset(1000);
        const latLng = entry.marker.getLatLng();
        if (!map.getBounds().pad(-0.18).contains(latLng)) {
          map.panTo(latLng, { animate: true, duration: 0.4 });
        }
      } else {
        entry.marker.setIcon(icons.idle);
        entry.marker.setZIndexOffset(0);
      }
    }
  }, [activeId]);

  // Track active marker pixel position so the React overlay can follow pan/zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      if (!activeId) {
        setPreviewPos(null);
        return;
      }
      const entry = markersRef.current.get(activeId);
      if (!entry) {
        setPreviewPos(null);
        return;
      }
      const point = map.latLngToContainerPoint(entry.marker.getLatLng());
      setPreviewPos({ x: point.x, y: point.y });
    };

    update();
    map.on("move", update);
    map.on("zoom", update);
    map.on("resize", update);
    return () => {
      map.off("move", update);
      map.off("zoom", update);
      map.off("resize", update);
    };
  }, [activeId]);

  // Invalidate size when the container becomes visible / resizes
  useEffect(() => {
    const map = mapRef.current;
    const el = containerRef.current;
    if (!map || !el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
        data-testid="pms-listings-map"
      />
      {activeListing && previewPos && (
        <div
          className="absolute z-[1000] pointer-events-none"
          style={{ left: previewPos.x, top: previewPos.y }}
        >
          <div
            className="pointer-events-auto"
            style={{
              transform: "translate(-50%, calc(-100% - 44px))",
            }}
          >
            <MapPreviewCard
              listing={activeListing}
              basePath={basePath}
              onMouseEnter={() => onActivate(activeListing.id)}
              onMouseLeave={onDeactivate}
            />
          </div>
        </div>
      )}
    </div>
  );
}
