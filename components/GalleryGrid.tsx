import { SafeImg } from './SafeImg';
import { useState } from 'react';

interface GalleryGridProps {
  images: string[];
  propertyName: string;
  className?: string;
}

export const GalleryGrid = ({ images, propertyName, className = '' }: GalleryGridProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-[#e3e1d8] rounded-2xl p-8 text-center">
        <p className="text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
          No gallery images available
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-semibold text-[#6e5d41] font-gilroy">
          Property Gallery
        </h2>
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <SafeImg
                src={image}
                alt={`${propertyName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Show total count */}
        <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </p>
      </div>

      {/* Simple Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <SafeImg
              src={selectedImage}
              alt={propertyName}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};