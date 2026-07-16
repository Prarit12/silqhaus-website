import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface PropertyMapProps {
  lat: number;
  lng: number;
  propertyName: string;
  className?: string;
  overlayText?: string;
  showHeading?: boolean;
}

export default function PropertyMap({
  lat,
  lng,
  propertyName,
  className = "",
  overlayText,
  showHeading = true,
}: PropertyMapProps) {
  const t = useTranslations("propertyMap");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);

      // Add tile layer
      //  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        },
      ).addTo(mapInstanceRef.current);

      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-[#ffffff] text-white rounded-full shadow-lg border-2 border-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Add marker with popup
      L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-sm mb-1">${propertyName}</h3>
          </div>
        `,
        )
        .openPopup();
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, propertyName]);

  return (
    <section className={`relative z-0 ${className}`}>
      {showHeading && (
        <div className="mb-6">
          <h2 className="font-bold text-white mb-4 font-gilroy text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#ffffff]" />
            {t("locationAndMap")}
          </h2>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg">
        <div
          ref={mapRef}
          className="w-full h-64 md:h-80 lg:h-96"
          data-testid="property-map"
        />

        {/* Map overlay with glass effect */}
        {overlayText && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-poppins">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ffffff]" />
              <span>{overlayText}</span>
            </div>
          </div>
        )}

        {/* Directions link */}
        <div className="absolute bottom-4 right-4">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffffff] hover:bg-[#6b5a20] text-white px-4 py-2 rounded-lg text-sm font-poppins transition-colors duration-200 shadow-lg"
            data-testid="directions-link"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Location Details - Commented out
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 font-poppins">
            Nearby Attractions
          </h3>
          <ul className="text-white/80 text-sm space-y-1 font-poppins">
            <li>• Laguna Golf Club (5 mins)</li>
            <li>• Bang Tao Beach (10 mins)</li>
            <li>• Boat Avenue Shopping (8 mins)</li>
            <li>• Layan Beach (12 mins)</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-2 font-poppins">
            Transportation
          </h3>
          <ul className="text-white/80 text-sm space-y-1 font-poppins">
            <li>• Phuket Airport (25 mins)</li>
            <li>• Patong Beach (35 mins)</li>
            <li>• Phuket Town (45 mins)</li>
            <li>• Local taxi services available</li>
          </ul>
        </div>
      </div>
      */}
    </section>
  );
}
