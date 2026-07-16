interface AmenityPillsProps {
  amenities: string[];
  className?: string;
}

export const AmenityPills = ({ amenities, className = '' }: AmenityPillsProps) => {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold text-[#6e5d41] font-gilroy">
        Amenities
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, index) => (
          <span
            key={index}
            className="inline-block px-4 py-2 bg-[#e3e1d8] text-[#6e5d41] rounded-full text-sm font-medium hover:bg-[#6e5d41] hover:text-white transition-colors duration-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {amenity}
          </span>
        ))}
      </div>
      
      <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {amenities.length} {amenities.length === 1 ? 'amenity' : 'amenities'} available
      </p>
    </div>
  );
};