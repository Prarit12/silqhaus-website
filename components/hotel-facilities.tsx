import React from 'react';
import { Wifi, Car, Utensils, Dumbbell, Waves, Sparkles } from 'lucide-react';

const facilities = [
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary fiber-optic internet throughout all properties'
  },
  {
    icon: Car,
    title: 'Valet Service',
    description: 'Professional valet parking and luxury transportation'
  },
  {
    icon: Utensils,
    title: 'Fine Dining',
    description: 'Michelin-starred chefs and curated culinary experiences'
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'State-of-the-art equipment and personal training'
  },
  {
    icon: Waves,
    title: 'Spa & Wellness',
    description: 'Traditional Thai massage and holistic treatments'
  },
  {
    icon: Sparkles,
    title: 'Concierge',
    description: 'Personalized service and local experience curation'
  }
];

export default function HotelFacilities() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Layered Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-bronze/5 via-ivory to-tan/10"></div>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-tan/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-bronze/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cream/20 rounded-full blur-2xl"></div>
      </div>
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="relative max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header */}
        <div className="text-center mb-24">
          
          
          <h2 className="text-5xl md:text-6xl font-gilroy font-light text-bronze mb-8 tracking-tight">
            SILQHAUS
            <span className="block text-tan font-light mt-2">FACILITIES</span>
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-bronze/80 font-light leading-relaxed mb-6">
              Immerse yourself in <span className="text-bronze font-medium">luxury</span> with our comprehensive range of <span className="text-bronze font-medium">world-class amenities</span> and <span className="text-bronze font-light">personalized services</span>.
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-tan to-transparent mx-auto"></div>
          </div>
        </div>

        {/* Enhanced Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="group relative">
                {/* Card Background */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-bronze/5 border border-tan/10 hover:shadow-xl hover:shadow-bronze/10 transition-all duration-500 hover:scale-105 hover:bg-white/90">
                  
                  {/* Icon Container with Enhanced Design */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cream to-tan/20 rounded-2xl flex items-center justify-center group-hover:from-tan group-hover:to-bronze/20 transition-all duration-500 shadow-md">
                      <Icon className="w-10 h-10 text-bronze group-hover:text-white transition-all duration-500" />
                    </div>
                    
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl border-2 border-tan/20 group-hover:border-tan/40 transition-all duration-500 group-hover:scale-110"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-bronze mb-4 group-hover:text-bronze/90 transition-colors duration-300">
                      {facility.title}
                    </h3>
                    <p className="text-bronze/70 font-light leading-relaxed group-hover:text-bronze/80 transition-colors duration-300">
                      {facility.description}
                    </p>
                  </div>

                  {/* Subtle Card Accent */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-tan/30 to-transparent group-hover:via-tan/60 transition-all duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center justify-center space-x-4 mb-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-tan"></div>
            <div className="w-4 h-4 bg-tan rounded-full shadow-lg"></div>
            <div className="w-32 h-px bg-tan"></div>
            <div className="w-4 h-4 bg-bronze rounded-full shadow-lg"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-tan"></div>
          </div>
          
          <p className="text-bronze/60 font-light italic max-w-lg mx-auto">
            "Every detail crafted to elevate your experience and create unforgettable moments in Thailand's most exclusive properties."
          </p>
        </div>
      </div>
    </section>
  );
}