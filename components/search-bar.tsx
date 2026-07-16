import React, { useEffect, useState } from 'react';

// Type declaration for Hostaway widgets
declare global {
  interface Window {
    searchBar: (config: any) => void;
    hostawayCalendarWidget: (config: any) => void;
  }
}

interface SearchBarProps {
  className?: string;
  variant?: 'hero' | 'compact' | 'calendar';
  listingId?: number;
}

// Sample property data for recommendations
const sampleProperties = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Phuket, Thailand",
    price: "$450/night",
    image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400&h=250&fit=crop",
    features: ["Ocean View", "5 Bedrooms", "Private Pool"]
  },
  {
    id: 2,
    title: "Modern Bangkok Penthouse",
    location: "Bangkok, Thailand",
    price: "$320/night",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop",
    features: ["City View", "3 Bedrooms", "Rooftop Terrace"]
  },
  {
    id: 3,
    title: "Tropical Garden Villa",
    location: "Koh Samui, Thailand",
    price: "$380/night",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop",
    features: ["Garden View", "4 Bedrooms", "Spa Room"]
  },
  {
    id: 4,
    title: "Mountain Retreat House",
    location: "Chiang Mai, Thailand",
    price: "$220/night",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
    features: ["Mountain View", "2 Bedrooms", "Hot Tub"]
  },
  {
    id: 5,
    title: "Seaside Escape Condo",
    location: "Hua Hin, Thailand",
    price: "$180/night",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=250&fit=crop",
    features: ["Sea View", "2 Bedrooms", "Balcony"]
  }
];

export default function SearchBar({ className = '', variant = 'hero', listingId = 40467 }: SearchBarProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Where to?');
  const [selectedCheckIn, setSelectedCheckIn] = useState('Check-in');
  const [selectedCheckOut, setSelectedCheckOut] = useState('Check-out');
  const [selectedGuests, setSelectedGuests] = useState('Guests');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  const locations = [
    'Bangkok',
    'Phuket', 
    'Koh Samui',
    'Chiang Mai',
    'Hua Hin',
    'Pattaya',
    'Krabi'
  ];
  
  useEffect(() => {
    if (variant === 'hero' || variant === 'compact') {
      // Load Hostaway search widget script
      const script = document.createElement('script');
      script.src = 'https://d2q3n06xhbi0am.cloudfront.net/widget.js?1640277196';
      script.onload = () => {
        if (window.searchBar) {
          window.searchBar({
            baseUrl: 'https://www.mywebsite.com/',
            showLocation: true,
            color: '#8B7355', // bronze color to match Search button
            rounded: true,
            openInNewTab: true,
            font: 'Open Sans',
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [variant]);

  useEffect(() => {
    if (variant === 'calendar') {
      // Load Hostaway calendar widget script
      const script = document.createElement('script');
      script.src = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js';
      script.onload = () => {
        if (window.hostawayCalendarWidget) {
          window.hostawayCalendarWidget({
            baseUrl: 'https://www.mywebsite.com/',
            listingId: listingId,
            numberOfMonths: 2,
            openInNewTab: true,
            font: 'Open Sans',
            rounded: true,
            button: {
              action: 'checkout',
              text: 'Book now',
            },
            clearButtonText: 'Clear dates',
            color: {
              mainColor: '#8B7355', // bronze color to match Search button
              frameColor: '#000000',
              textColor: '#8B7355',
            },
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [variant, listingId]);

  if (variant === 'calendar') {
    return (
      <div className={`${className}`}>
        <div id="hostaway-calendar-widget"></div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div id="hostaway-booking-widget"></div>
      </div>
    );
  }

  // Hero variant - Clean Button-Based Search with design matching the reference image
  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      
      {/* Hostaway Widget (Hidden but still loaded for functionality) */}
      <div id="hostaway-booking-widget" className="hidden"></div>
    </div>
  );
}
