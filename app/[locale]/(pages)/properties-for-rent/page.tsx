"use client";
import { PMSListingsWithMap } from "@/components/pms-listings-with-map";

export default function PropertiesForRentPage() {
  return (
    <PMSListingsWithMap
      listingType="RENT"
      basePath="properties-for-rent"
      namespace="propertiesForRent"
    />
  );
}
