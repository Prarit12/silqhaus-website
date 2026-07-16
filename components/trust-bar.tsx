import React from 'react';
import { MessageCircle, Star, Home, Moon } from 'lucide-react';

const trustMetrics = [
  {
    icon: MessageCircle,
    title: '24/7 Concierge',
    description: 'Always available'
  },
  {
    icon: Star,
    title: '1,000+ 5-Star Reviews',
    description: 'Guest satisfaction'
  },
  {
    icon: Home,
    title: 'Hotel-Grade Cleaning',
    description: 'Pristine standards'
  },
  {
    icon: Moon,
    title: 'Dreamy Beds',
    description: 'Perfect sleep'
  }
];

export default function TrustBar() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-12 text-center max-w-4xl mx-auto">
          <div className="flex-1">
            <div className="text-2xl font-bold text-charcoal mb-1">1,000+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Happy Guests</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-charcoal mb-1">24/7</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Concierge</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-charcoal mb-1">200+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Destinations</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-charcoal mb-1">5-Star</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Quality</div>
          </div>
        </div>
      </div>
    </section>
  );
}
