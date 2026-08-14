import { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaDatabase,
  FaSearch,
  FaHeadset,
  FaBullhorn,
} from "react-icons/fa";

export default function WhatWeOfferSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
            );
            setVisibleItems((prev) => Array.from(new Set([...prev, index])));
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px)`,
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>
      {/* Desktop and Tablet - Text + Image Layout */}
      <div className="hidden md:block relative max-w-site mx-auto px-4 md:px-6">
        <div className="flex items-center min-h-[60vh] gap-8">
          {/* Left Box - 40% Width - Text Content */}
          <div className="basis-[40%] flex flex-col justify-center space-y-6">
            {/* Title */}
            <h2 className="font-gilroy lg:text-3xl text-black font-medium text-[24px]">
              What We Offer
            </h2>

            {/* Services Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue Management */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col items-start space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-sm text-black">
                    Revenue Management
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed">
                    Dynamic pricing, market benchmarking, and comprehensive
                    tracking.
                  </p>
                </div>
              </div>

              {/* Booking Services */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col items-start space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-sm text-black">
                    Booking Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed">
                    Complete OTA setup, calendar control, and direct booking
                    integration.
                  </p>
                </div>
              </div>

              {/* Marketing Services */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col items-start space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-sm text-black">
                    Marketing Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed">
                    Professional photography, social media campaigns, and
                    listing optimization.
                  </p>
                </div>
              </div>

              {/* Taxation Services */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/90 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex flex-col items-start space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-sm text-black">
                    Taxation Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed">
                    Real-time dashboard access, guest concierge solutions, and
                    transparent reporting.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button className="font-poppins bg-gradient-to-r from-[#ffffff] to-[#957e34] text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-lg hover:scale-105 transition-all duration-300">
                Explore Properties
              </button>
            </div>
          </div>

          {/* Right Box - 60% Width - Our Tools & Platforms Grid */}
          <div className="basis-[60%] h-[60vh] bg-black rounded-2xl shadow-xl overflow-y-auto">
            <div className="px-6 md:px-10 py-8">
              <h2 className="text-center text-white text-3xl md:text-4xl font-gilroy font-semibold">
                Our Tools &amp; Platforms
              </h2>
              <p className="text-center text-white/70 max-w-2xl mx-auto text-[14px] mt-[0px] mb-[0px]">
                Enterprise-grade technology seamlessly integrated to deliver
                exceptional results.
              </p>

              {/* Tools Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Hostaway */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    Hostaway
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    Comprehensive channel & booking manager with multi-platform
                    sync.
                  </p>
                </div>

                {/* PriceLabs */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 17l6-6 4 4 8-8"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    PriceLabs
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    Dynamic pricing engine using demand and market signals.
                  </p>
                </div>

                {/* AirDNA */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    AirDNA
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    Market analytics platform for rental performance insights.
                  </p>
                </div>

                {/* Rankbreeze */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    Rankbreeze
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    SEO optimization to improve listing visibility & ranking.
                  </p>
                </div>

                {/* HandiGo */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6.938 4.938a9 9 0 1110.125 14.124l-3.029-3.03a4.5 4.5 0 00-6.364-6.364L6.938 4.938z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    HandiGo
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    Digital concierge & guest support for seamless experiences.
                  </p>
                </div>

                {/* Meta & Google Ads */}
                <div className="group bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-2xl hover:shadow-[#ffffff]/20 hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50 hover:border-[#ffffff]/30 hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col items-center justify-start min-h-[160px] cursor-pointer">
                  <div className="w-12 h-12 grid place-items-center rounded-full bg-[#ffffff]/10 text-[#ffffff] shadow-sm group-hover:bg-[#ffffff] group-hover:shadow-lg group-hover:shadow-[#ffffff]/30 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618V15.38a1 1 0 01-1.447.894L15 14M4 6h8M4 10h8m-8 4h8"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-3 font-bold text-black text-[14px] group-hover:text-[#ffffff] transition-colors duration-300">
                    Meta & Google Ads
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-black/65 max-w-[24ch] mx-auto group-hover:text-black/80 transition-colors duration-300">
                    Targeted campaigns to grow direct bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile - Stacked Layout */}
      <div className="md:hidden px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Left Box Content - Mobile (Centered Text) */}
          <div className="text-center space-y-6">
            {/* Title */}
            <h2 className="font-gilroy font-bold text-xl text-black leading-tight">
              What We Offer
            </h2>

            {/* Services Cards - Mobile */}
            <div className="grid grid-cols-1 gap-3">
              {/* Revenue Management */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/95 hover:shadow-xl hover:shadow-[#ffffff]/10 hover:border-[#ffffff]/30 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-xs text-black group-hover:text-[#ffffff] transition-colors duration-300">
                    Revenue Management
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Dynamic pricing, market benchmarking, and comprehensive
                    tracking.
                  </p>
                </div>
              </div>

              {/* Booking Services */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/95 hover:shadow-xl hover:shadow-[#ffffff]/10 hover:border-[#ffffff]/30 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-xs text-black group-hover:text-[#ffffff] transition-colors duration-300">
                    Booking Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Complete OTA setup, calendar control, and direct booking
                    integration.
                  </p>
                </div>
              </div>

              {/* Marketing Services */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/95 hover:shadow-xl hover:shadow-[#ffffff]/10 hover:border-[#ffffff]/30 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-xs text-black group-hover:text-[#ffffff] transition-colors duration-300">
                    Marketing Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Professional photography, social media campaigns, and
                    listing optimization.
                  </p>
                </div>
              </div>

              {/* Taxation Services */}
              <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm hover:bg-white/95 hover:shadow-xl hover:shadow-[#ffffff]/10 hover:border-[#ffffff]/30 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ffffff] to-[#957e34] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-lg transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  {/* Title */}
                  <h3 className="font-poppins font-bold text-xs text-black group-hover:text-[#ffffff] transition-colors duration-300">
                    Taxation Services
                  </h3>
                  {/* Description */}
                  <p className="font-poppins text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    Real-time dashboard access, guest concierge solutions, and
                    transparent reporting.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button className="font-poppins bg-gradient-to-r from-[#ffffff] to-[#957e34] text-white px-5 py-2 rounded-xl font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
                Explore Properties
              </button>
            </div>
          </div>

          {/* Right Box Content - Mobile (Our Tools & Platforms) */}
          <div className="bg-black rounded-2xl shadow-xl p-6">
            <h2 className="font-gilroy font-bold text-lg text-white text-center mb-8">
              Our Tools & Platforms
            </h2>

            <div className="space-y-6">
              {/* Hostaway */}
              <div
                ref={(el) => {
                  itemRefs.current[6] = el;
                }}
                data-index="6"
                className={`text-left group transition-all duration-700 ${
                  visibleItems.includes(6)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaCalendarAlt className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  Hostaway
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  Comprehensive property management system for bookings,
                  calendar synchronization, and guest communications.
                </p>
              </div>

              {/* PriceLabs */}
              <div
                ref={(el) => {
                  itemRefs.current[7] = el;
                }}
                data-index="7"
                className={`text-left group transition-all duration-700 delay-100 ${
                  visibleItems.includes(7)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaChartLine className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  PriceLabs
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  Dynamic pricing optimization using market data and demand
                  patterns to maximize revenue.
                </p>
              </div>

              {/* AirDNA */}
              <div
                ref={(el) => {
                  itemRefs.current[8] = el;
                }}
                data-index="8"
                className={`text-left group transition-all duration-700 delay-200 ${
                  visibleItems.includes(8)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaDatabase className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  AirDNA
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  Market intelligence and analytics platform providing insights
                  on rental performance and competition.
                </p>
              </div>

              {/* Rankbreeze */}
              <div
                ref={(el) => {
                  itemRefs.current[9] = el;
                }}
                data-index="9"
                className={`text-left group transition-all duration-700 delay-300 ${
                  visibleItems.includes(9)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaSearch className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  Rankbreeze
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  SEO optimization tools to improve property visibility and
                  search rankings across booking platforms.
                </p>
              </div>

              {/* HandiGo */}
              <div
                ref={(el) => {
                  itemRefs.current[10] = el;
                }}
                data-index="10"
                className={`text-left group transition-all duration-700 delay-500 ${
                  visibleItems.includes(10)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaHeadset className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  HandiGo
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  24/7 concierge services and guest support platform for
                  enhanced customer experience.
                </p>
              </div>

              {/* Meta & Google Ads */}
              <div
                ref={(el) => {
                  itemRefs.current[11] = el;
                }}
                data-index="11"
                className={`text-left group transition-all duration-700 delay-700 ${
                  visibleItems.includes(11)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="w-12 h-12 mb-4 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:bg-[#ffffff] group-hover:scale-110 transition-all duration-300">
                  <FaBullhorn className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-bold text-lg text-white mb-2">
                  Meta & Google Ads
                </h3>
                <p className="font-poppins text-xs text-[#f4f4f1] leading-relaxed">
                  Targeted advertising campaigns across social media and search
                  platforms to drive bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
