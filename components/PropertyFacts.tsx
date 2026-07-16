import { MapPin, Bed, Bath, Users, Home } from 'lucide-react';

interface Property {
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  sleeps?: number;
  sizeSqm?: number;
  priceBase?: number;
}

interface PropertyFactsProps {
  property: Property;
}

export const PropertyFacts = ({ property }: PropertyFactsProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-[#e3e1d8] rounded-2xl p-6 space-y-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 className="text-xl font-semibold text-[#6e5d41] mb-4 font-gilroy">Property Details</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location */}
        {property.location && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#6e5d41]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{property.location}</p>
            </div>
          </div>
        )}

        {/* Bedrooms */}
        {property.bedrooms && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Bed className="w-5 h-5 text-[#6e5d41]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="font-medium text-gray-900">{property.bedrooms}</p>
            </div>
          </div>
        )}

        {/* Bathrooms */}
        {property.bathrooms && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Bath className="w-5 h-5 text-[#6e5d41]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="font-medium text-gray-900">{property.bathrooms}</p>
            </div>
          </div>
        )}

        {/* Sleeps */}
        {property.sleeps && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#6e5d41]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-medium text-gray-900">{property.sleeps}</p>
            </div>
          </div>
        )}

        {/* Size */}
        {property.sizeSqm && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-[#6e5d41]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Size</p>
              <p className="font-medium text-gray-900">{property.sizeSqm} m²</p>
            </div>
          </div>
        )}

        {/* Price */}
        {property.priceBase && (
          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="w-10 h-10 bg-[#6e5d41] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">฿</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Base Price</p>
              <p className="font-bold text-lg text-[#6e5d41]">{formatPrice(property.priceBase)} per night</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};