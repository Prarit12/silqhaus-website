"use client";

import { useState } from "react";
import Image from "next/image";
import { processImageUrl, getPlaceholderImage } from "@/utils/imageUtils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  loading = "lazy",
  sizes = "100vw",
  priority,
  fill = true,
  width,
  height,
  onLoad,
  onError,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(processImageUrl(src));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getPlaceholderImage());
      onError?.();
    }
  };

  const handleLoad = () => {
    onLoad?.();
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority || loading === "eager"}
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          data-testid={`image-${alt.toLowerCase().replace(/\s+/g, "-")}`}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      sizes={sizes}
      priority={priority || loading === "eager"}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      data-testid={`image-${alt.toLowerCase().replace(/\s+/g, "-")}`}
    />
  );
}
