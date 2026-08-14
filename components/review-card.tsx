"use client";

import { SiAirbnb, SiTripadvisor, SiGoogle, SiExpedia } from "react-icons/si";
import { Star } from "lucide-react";
import { getChannelName } from "@/config/ota-channels";
import StarRow from "@/components/star-row";

export interface ReviewData {
  reviewerName: string;
  publicReview: string;
  rating: number;
  channelId: number;
  listingMapId: number;
  insertedOn: string;
  listingName?: string;
}

interface ReviewCardProps {
  review: ReviewData;
  variant?: "homepage" | "property";
  otaUrl?: string | null;
  hideListingName?: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

function OTAIcon({ channelId }: { channelId: number }) {
  const badge = "flex items-center justify-center w-10 h-10 rounded-full";
  switch (channelId) {
    case 2018:
      return (
        <div className={`${badge} bg-[#FF5A5F]`}>
          <SiAirbnb className="w-5 h-5 text-white" />
        </div>
      );
    case 2005:
      return (
        <div className={`${badge} bg-[#003580]`}>
          <span className="text-white font-bold text-[9px]">B.com</span>
        </div>
      );
    case 2016:
      return (
        <div className={`${badge} bg-[#34E0A1]`}>
          <SiTripadvisor className="w-5 h-5 text-white" />
        </div>
      );
    case 2022:
      return (
        <div className={`${badge} bg-[#4285F4]`}>
          <SiGoogle className="w-5 h-5 text-white" />
        </div>
      );
    case 2007:
      return (
        <div className={`${badge} bg-[#FFCC00]`}>
          <SiExpedia className="w-5 h-5 text-white" />
        </div>
      );
    case 2002:
    case 2009:
    case 2010:
      return (
        <div className={`${badge} bg-[#3D67A6]`}>
          <span className="text-white font-bold text-xs">Vrbo</span>
        </div>
      );
    default:
      return (
        <div className={`${badge} bg-[#ffffff]`}>
          <Star className="w-5 h-5 text-white" />
        </div>
      );
  }
}

export function ReviewCard({
  review,
  variant = "homepage",
  otaUrl,
  hideListingName,
}: ReviewCardProps) {
  const channelName = getChannelName(review.channelId);
  const isProperty = variant === "property";
  const charLimit = 200;
  const charLimit2 = 110;

  if (isProperty) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between w-full h-[300px] sm:h-[280px]">
        <div className="flex flex-col justify-between h-full">
          <p className="text-ink/90 text-md font-poppins leading-relaxed flex-1 overflow-hidden">
            &ldquo;{truncateText(review.publicReview, charLimit)}&rdquo;
          </p>
          <div className="flex items-center gap-3 text-md text-neutral-500">
            <p className="text-ink font-medium font-poppins">
              {review.reviewerName}
            </p>
            <span aria-hidden="true">&middot;</span>
            <p className="text-neutral-500 font-poppins">
              {formatDate(review.insertedOn)}
            </p>
          </div>
        </div>
        <div className="pt-3 mt-2 border-t border-neutral-100">
          {otaUrl && (
            <a
              href={otaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-600 text-md font-poppins hover:text-ink transition-colors"
            >
              <OTAIcon channelId={review.channelId} />
              <span>View on {channelName}</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.04] ring-1 ring-line rounded-2xl p-5 flex flex-col gap-3 w-full min-h-[140px] text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
          {channelName}
        </span>
        {/* Hostaway scores arrive on a 10-scale; show them as five stars. */}
        <StarRow value={review.rating > 5 ? review.rating / 2 : review.rating} />
      </div>

      <p className="text-white/85 text-[15px] leading-relaxed min-h-[40px]">
        &ldquo;{truncateText(review.publicReview, charLimit2)}&rdquo;
      </p>

      <div className="mt-auto pt-3 border-t border-line">
        <p className="text-white font-semibold text-sm">
          {review.reviewerName}
        </p>
        <p className="text-white/45 text-xs mt-0.5">
          {!hideListingName && review.listingName && (
            <span>{review.listingName} &middot; </span>
          )}
          {formatDate(review.insertedOn)}
        </p>
      </div>
    </div>
  );
}
