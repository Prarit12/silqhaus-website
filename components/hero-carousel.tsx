"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const villaImages = [
  {
    src: "/photos/properties/Beach_1756385610227.jpg",
    alt: "Aerial view of luxury beachfront resort with pristine turquoise waters",
  },
  {
    src: "/photos/properties/Swimming Pool_1756387850882.jpg",
    alt: "Stunning infinity pool villa with panoramic ocean and mountain views",
  },
  {
    src: "/photos/locations/gallery-sri-panwa-luxury-hotel-vacation-activities-in-phuket-tennis-top-view_1756387834693.jpg",
    alt: "Exclusive resort complex with tennis court and luxury accommodations",
  },
  {
    src: "/photos/properties/DJI_20240610150655_0045_D-Enhanced-NR_1757945087441.jpg",
    alt: "Championship golf course with water features and tropical landscape",
  },
  {
    src: "/photos/properties/Beach (1)_1756387921198.jpg",
    alt: "Panoramic coastal view of pristine beaches and tropical islands",
  },
];

export default function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % villaImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    villaImages.forEach((image) => {
      const imgEl = new window.Image();
      imgEl.src = image.src;
    });
  }, []);

  return (
    <div className="absolute inset-0">
      {villaImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
            {...(index === 0
              ? { priority: true, loading: "eager" as const }
              : {})}
          />
        </div>
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, 
            rgba(0, 0, 0, 0.6) 0%, 
            rgba(0, 0, 0, 0.45) 25%, 
            rgba(0, 0, 0, 0.35) 50%, 
            rgba(0, 0, 0, 0.25) 75%, 
            rgba(0, 0, 0, 0.2) 100%)`,
        }}
      ></div>
      <div
        className="absolute inset-0 pointer-events-none sm:opacity-0 opacity-20"
        style={{
          background: `linear-gradient(to top, 
            rgba(0, 0, 0, 0.3) 0%, 
            rgba(0, 0, 0, 0.1) 50%, 
            transparent 100%)`,
        }}
      ></div>
    </div>
  );
}
