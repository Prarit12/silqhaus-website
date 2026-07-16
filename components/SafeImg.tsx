"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface SafeImgProps {
  src?: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallbackClassName?: string;
  priority?: boolean;
  sizes?: string;
  [key: string]: any;
}

export const SafeImg = ({
  src,
  alt = "Property image",
  className,
  loading = "lazy",
  fallbackClassName,
  priority,
  sizes = "100vw",
  ...rest
}: SafeImgProps) => {
  const [bad, setBad] = useState(false);
  const finalSrc = src?.trim() || "";

  useEffect(() => {
    setBad(false);
  }, [finalSrc]);

  if (!finalSrc || bad) {
    return (
      <div
        className={
          fallbackClassName ||
          className ||
          "w-full h-full bg-[#e3e1d8] flex items-center justify-center rounded-2xl"
        }
      >
        <span className="text-[#6e5d41] text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority || loading === "eager"}
        onError={() => setBad(true)}
        className={className}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
