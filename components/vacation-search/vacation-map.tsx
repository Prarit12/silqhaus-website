"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react";
import { displayPropertyName } from "@/config/property-names";
import { spreadDuplicateCoords, clusterByPixelDistance, type LatLng } from "./geo";
import type { SearchItem } from "./types";
import { VacationMapCard } from "./vacation-map-card";

interface VacationMapProps {
  items: SearchItem[];
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (key: string) => void;
  onHoverEnd: () => void;
  onSelect: (key: string) => void;
  onClearSelection: () => void;
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null };
  /** The floating popup card over the pin. Off on mobile, where the parent
   *  renders the selected property as a bottom sheet instead. */
  showSelectedCard?: boolean;
  t: any;
}

interface DisplayEntry {
  key: string;
  latLng: LatLng;
  item: SearchItem;
}

function pillLabel(item: SearchItem): string {
  if (item.nightly) return `฿${Math.round(item.nightly).toLocaleString()}`;
  return displayPropertyName(item.property);
}

function buildPillIcon(item: SearchItem, active: boolean): L.DivIcon {
  const unavailable = item.isUnavailable;
  const bg = active ? "#0d0d0d" : unavailable ? "#f3f4f6" : "#ffffff";
  const color = active ? "#ffffff" : unavailable ? "#9ca3af" : "#0d0d0d";
  const border = active ? "#0d0d0d" : "rgba(0,0,0,0.10)";
  const scale = active ? 1.06 : 1;
  const label = pillLabel(item);
  return L.divIcon({
    className: "silq-price-pill",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="transform:translate(-50%,-50%) scale(${scale});white-space:nowrap;padding:5px 11px;border-radius:9999px;background:${bg};color:${color};font-family:var(--font-manrope),system-ui,sans-serif;font-weight:600;font-size:13px;line-height:1;box-shadow:0 2px 8px rgba(0,0,0,0.22);border:1px solid ${border};cursor:pointer;transition:transform .12s ease;">${label}</div>`,
  });
}

/** A "N homes" badge for a group of properties too close to show separately. */
function buildClusterIcon(count: number): L.DivIcon {
  return L.divIcon({
    className: "silq-cluster",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="transform:translate(-50%,-50%);display:grid;place-items:center;min-width:34px;height:34px;padding:0 10px;border-radius:9999px;background:#0d0d0d;color:#fff;font-family:var(--font-manrope),system-ui,sans-serif;font-weight:700;font-size:13px;line-height:1;box-shadow:0 2px 10px rgba(0,0,0,0.32);border:2px solid #fff;cursor:pointer;">${count}</div>`,
  });
}

export default function VacationMap({
  items,
  hoveredId,
  selectedId,
  onHover,
  onHoverEnd,
  onSelect,
  onClearSelection,
  searchDates,
  showSelectedCard = true,
  t,
}: VacationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const displayRef = useRef<Map<string, DisplayEntry>>(new Map());
  const lastFitKeyRef = useRef<string>("");
  const [selectedPos, setSelectedPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Latest props for map event handlers (avoid stale closures / re-binding).
  const cbRef = useRef({ onHover, onHoverEnd, onSelect });
  cbRef.current = { onHover, onHoverEnd, onSelect };
  const stateRef = useRef({ hoveredId, selectedId });
  stateRef.current = { hoveredId, selectedId };

  // Spread exact-duplicate coordinates once per item-set change.
  const display = useMemo<DisplayEntry[]>(() => {
    const withCoords = items
      .filter((it) => it.latLng)
      .map((it) => ({ key: it.key, latLng: it.latLng as LatLng, item: it }));
    return spreadDuplicateCoords(withCoords);
  }, [items]);

  // Keep a key→entry map for popup positioning + marker building.
  useEffect(() => {
    const map = new Map<string, DisplayEntry>();
    for (const d of display) map.set(d.key, d);
    displayRef.current = map;
  }, [display]);

  // Rebuild all markers (10 items — cheap) with the current declutter + styles.
  const renderMarkers = useRef<() => void>(() => {});
  renderMarkers.current = () => {
    const map = mapRef.current;
    if (!map) return;
    const { hoveredId: hov, selectedId: sel } = stateRef.current;

    for (const m of markersRef.current.values()) m.remove();
    markersRef.current.clear();

    // Stable order so clustering seeds deterministically; the active pin is
    // pulled out first so it always renders as its own pill (never hidden in a
    // badge while its popup is open).
    const entries = [...displayRef.current.values()].sort((a, b) =>
      a.key.localeCompare(b.key),
    );
    const active = entries.filter((d) => d.key === sel || d.key === hov);
    const rest = entries.filter((d) => d.key !== sel && d.key !== hov);

    const clusters = clusterByPixelDistance(rest, (ll) =>
      map.latLngToContainerPoint(L.latLng(ll.lat, ll.lng)),
    );

    // Active pins: always a pill.
    for (const d of active) {
      const marker = L.marker([d.latLng.lat, d.latLng.lng], {
        icon: buildPillIcon(d.item, true),
        zIndexOffset: d.key === sel ? 2000 : 1000,
        riseOnHover: true,
      });
      marker.on("mouseover", () => cbRef.current.onHover(d.key));
      marker.on("mouseout", () => cbRef.current.onHoverEnd());
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        cbRef.current.onSelect(d.key);
      });
      marker.addTo(map);
      markersRef.current.set(d.key, marker);
    }

    // Everything else: singleton → price pill, group → count badge.
    for (const cluster of clusters) {
      if (cluster.members.length === 1) {
        const d = cluster.members[0];
        const marker = L.marker([d.latLng.lat, d.latLng.lng], {
          icon: buildPillIcon(d.item, false),
          riseOnHover: true,
        });
        marker.on("mouseover", () => cbRef.current.onHover(d.key));
        marker.on("mouseout", () => cbRef.current.onHoverEnd());
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          cbRef.current.onSelect(d.key);
        });
        marker.addTo(map);
        markersRef.current.set(d.key, marker);
      } else {
        const memberLatLngs = cluster.members.map(
          (m) => [m.latLng.lat, m.latLng.lng] as [number, number],
        );
        const marker = L.marker([cluster.latLng.lat, cluster.latLng.lng], {
          icon: buildClusterIcon(cluster.members.length),
          zIndexOffset: 500,
        });
        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          // maxZoom 19 (the tile ceiling) so even members sharing near-identical
          // coordinates — the spread ZcapeX2 pair — split apart instead of
          // re-merging into the same badge at a shallow fit zoom.
          map.flyToBounds(L.latLngBounds(memberLatLngs), {
            padding: [80, 80],
            maxZoom: 19,
          });
        });
        marker.addTo(map);
        // Key the badge so it's cleaned up on the next rebuild.
        markersRef.current.set(
          `cluster:${cluster.members.map((m) => m.key).join(",")}`,
          marker,
        );
      }
    }
  };

  // Init the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
    }).setView([12.5, 99.5], 6);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      },
    ).addTo(map);

    map.on("click", () => onClearSelection());
    map.on("zoomend", () => renderMarkers.current());

    mapRef.current = map;
    renderMarkers.current();

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      lastFitKeyRef.current = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild markers whenever the display set or hover/selection changes.
  useEffect(() => {
    renderMarkers.current();
  }, [display, hoveredId, selectedId]);

  // Fit bounds when the set of mapped properties changes (not on hover).
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const fitKey = display
      .map((d) => `${d.key}@${d.latLng.lat.toFixed(4)},${d.latLng.lng.toFixed(4)}`)
      .sort()
      .join("|");
    if (!fitKey || fitKey === lastFitKeyRef.current) return;
    lastFitKeyRef.current = fitKey;
    if (display.length === 1) {
      map.setView([display[0].latLng.lat, display[0].latLng.lng], 13);
    } else {
      const bounds = L.latLngBounds(
        display.map((d) => [d.latLng.lat, d.latLng.lng] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14 });
    }
  }, [display]);

  // Track the selected pill's pixel position so the popup follows pan/zoom.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const entry = selectedId ? displayRef.current.get(selectedId) : null;
      if (!entry) {
        setSelectedPos(null);
        return;
      }
      const p = map.latLngToContainerPoint(
        L.latLng(entry.latLng.lat, entry.latLng.lng),
      );
      setSelectedPos({ x: p.x, y: p.y });
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
  }, [selectedId]);

  // Keep Leaflet sized to its container.
  useEffect(() => {
    const map = mapRef.current;
    const el = containerRef.current;
    if (!map || !el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Read from the `display` memo, not displayRef (which a post-render effect
  // updates a render late) — otherwise the open popup shows the previous
  // render's price/availability after a data change.
  const selectedItem = selectedId
    ? (display.find((d) => d.key === selectedId)?.item ?? null)
    : null;

  const zoomBtn =
    "grid place-items-center w-9 h-9 bg-white text-ink first:rounded-t-full last:rounded-b-full hover:bg-neutral-50 disabled:opacity-40";

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="absolute inset-0 bg-neutral-100"
        data-testid="vacation-map"
      />

      {/* Zoom controls (top-right, Airbnb-style) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col rounded-full border border-neutral-200 bg-white shadow-md overflow-hidden">
        <button
          type="button"
          aria-label={t("map.zoomIn")}
          className={zoomBtn}
          onClick={() => mapRef.current?.zoomIn()}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="h-px bg-neutral-200" aria-hidden="true" />
        <button
          type="button"
          aria-label={t("map.zoomOut")}
          className={zoomBtn}
          onClick={() => mapRef.current?.zoomOut()}
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Click popup card, anchored above the selected pill */}
      {showSelectedCard && selectedItem && selectedPos && (
        <div
          className="absolute z-[1100]"
          style={{ left: selectedPos.x, top: selectedPos.y }}
        >
          <div style={{ transform: "translate(-50%, calc(-100% - 24px))" }}>
            <VacationMapCard
              item={selectedItem}
              searchDates={searchDates}
              t={t}
              onClose={onClearSelection}
            />
          </div>
        </div>
      )}
    </div>
  );
}
