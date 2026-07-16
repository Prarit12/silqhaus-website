"use client";

import { useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
}

export const FallbackImage = ({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes = "100vw",
  priority,
}: FallbackImageProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Image
        src={hasError ? "/placeholder.jpg" : src}
        alt={alt || "Property image"}
        fill
        sizes={sizes}
        priority={priority || loading === "eager"}
        onError={() => setHasError(true)}
        className={`${className} object-cover rounded-2xl`}
      />
    </div>
  );
};
