import React from 'react';
import { MapPin, Users, Bed, Bath, Wifi, Car } from 'lucide-react';

export default function FeaturedProperty() {
  const featuredProperty = {
    id: 1,
    title: "Villa Serenity - Oceanfront Paradise",
    location: "Koh Samui",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    ],
    price: 8500,
    currency: "THB",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    description: "Experience unparalleled luxury in this stunning oceanfront villa featuring panoramic sea views, infinity pool, and world-class amenities. Perfect for discerning travelers seeking privacy and sophistication.",
    amenities: [
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Car, label: "Private Parking" },
      { icon: Users, label: "Concierge Service" }
    ]
  };

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-bronze rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-cream" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <p className="text-bronze text-sm font-light tracking-[0.3em] uppercase mb-4">FEATURED PROPERTY</p>
          <h2 className="text-4xl md:text-5xl font-gilroy font-light text-bronze mb-6 tracking-wide">Exceptional Villa</h2>
          <p className="text-xl text-bronze/70 max-w-3xl mx-auto font-light leading-relaxed">
            Discover our hand-selected luxury property offering the finest in comfort and elegance
          </p>
        </div>

        {/* Featured Property Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="relative h-96 lg:h-full">
              <img 
                src={featuredProperty.images[0]}
                alt={featuredProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-bronze text-cream px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                  FEATURED
                </span>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="absolute bottom-6 left-6 right-6 flex space-x-2">
                {featuredProperty.images.slice(1).map((image, index) => (
                  <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50">
                    <img 
                      src={image}
                      alt={`${featuredProperty.title} view ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <div className="flex items-center text-bronze/60 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium tracking-wide">{featuredProperty.location}</span>
                </div>
                <h3 className="text-3xl font-light text-bronze mb-4 leading-tight">
                  {featuredProperty.title}
                </h3>
                <p className="text-bronze/70 font-light leading-relaxed mb-6">
                  {featuredProperty.description}
                </p>
              </div>

              {/* Property Stats */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center text-bronze/70">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{featuredProperty.guests} Guests</span>
                </div>
                <div className="flex items-center text-bronze/70">
                  <Bed className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{featuredProperty.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center text-bronze/70">
                  <Bath className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{featuredProperty.bathrooms} Bathrooms</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h4 className="text-bronze font-medium mb-4">Premium Amenities</h4>
                <div className="flex flex-wrap gap-3">
                  {featuredProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center bg-cream px-3 py-2 rounded-lg">
                      <amenity.icon className="w-4 h-4 mr-2 text-bronze" />
                      <span className="text-sm text-bronze/80">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-bronze/60 font-medium">From</p>
                  <p className="text-3xl font-light text-bronze">
                    ฿{featuredProperty.price.toLocaleString()}
                    <span className="text-lg text-bronze/60 font-normal"> /night</span>
                  </p>
                </div>
                <button className="bg-bronze hover:bg-bronze/90 text-cream font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}