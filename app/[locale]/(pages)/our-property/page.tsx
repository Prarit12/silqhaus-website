"use client";
import { Suspense } from "react";
import { VacationSearch } from "@/components/vacation-search/vacation-search";

export default function OurProperty() {
  return (
    <Suspense fallback={null}>
      <VacationSearch />
    </Suspense>
  );
}
