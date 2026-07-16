"use client";

import { SiAirbnb, SiTripadvisor, SiGoogle, SiExpedia } from "react-icons/si";
import { Star } from "lucide-react";
import { getChannelName } from "@/config/ota-channels";

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
        <div className={`${badge} bg-[#7e6725]`}>
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
  const charLimit2 = 150;

  if (isProperty) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex flex-col justify-between w-full h-[300px] sm:h-[280px]">
        <div className="flex flex-col justify-between h-full">
          <p className="text-snow/80 text-md font-poppins leading-relaxed flex-1 overflow-hidden">
            &ldquo;{truncateText(review.publicReview, charLimit)}&rdquo;
          </p>
          <div className="flex items-center gap-3 text-md">
            <p className="text-snow font-medium font-poppins">
              {review.reviewerName}
            </p>
            <span>&middot;</span>
            <p className="text-snow/40 font-poppins">
              {formatDate(review.insertedOn)}
            </p>
          </div>
        </div>
        <div className="pt-3 mt-2 border-t border-white/5">
          {otaUrl && (
            <a
              href={otaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-snow/60 text-md font-poppins hover:text-snow/80 transition-colors"
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
    <div className="bg-snow border border-white/10 rounded-xl p-5 flex flex-col gap-3 w-full min-h-[220px]">
      <div className="flex items-start justify-between gap-3">
        <OTAIcon channelId={review.channelId} />
        <div className="flex items-center gap-1 bg-gold/20 px-2 py-1 rounded-md">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-gold font-bold text-lg leading-none">
            {review.rating}
          </span>
        </div>
      </div>

      <p className="text-ink-2 text-sm font-poppins leading-relaxed min-h-[40px] text-left">
        &ldquo;{truncateText(review.publicReview, charLimit2)}&rdquo;
      </p>

      <div className="mt-auto pt-2 border-t border-ink-2">
        <p className="text-ink-2 text-xs font-poppins text-left">
          {!hideListingName && review.listingName && (
            <span>{review.listingName} &middot; </span>
          )}
          {formatDate(review.insertedOn)}
        </p>
      </div>
    </div>
  );
}
