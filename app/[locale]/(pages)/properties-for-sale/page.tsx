"use client";
import { PMSListingsWithMap } from "@/components/pms-listings-with-map";

export default function PropertiesForSalePage() {
  return (
    <PMSListingsWithMap
      listingType="SALE"
      basePath="properties-for-sale"
      namespace="propertiesForSale"
    />
  );
}
