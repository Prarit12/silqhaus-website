"use client";

import { Link } from "@/i18n/navigation";
import { MapPin, ArrowRight } from "lucide-react";

const destinations = [
  {
    id: "phuket",
    name: "Phuket",
    description:
      "Thailand's largest island, known for its stunning beaches, vibrant nightlife, and world-class resorts.",
    image:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
    properties: 12,
  },
  {
    id: "pattaya",
    name: "Pattaya",
    description:
      "A vibrant coastal city offering beautiful beaches, entertainment, and luxury accommodations.",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    properties: 8,
  },
];

export default function Destination() {
  return (
    <main className="min-h-screen bg-ink text-snow">
      <section className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-gilroy font-light mb-4 uppercase">
              Our <span className="text-gold">Destinations</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Discover Thailand's most sought-after locations for luxury
              vacation rentals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destination/${dest.id}`}
                className="group relative h-96 rounded-2xl overflow-hidden"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 text-gold mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {dest.properties} Properties
                    </span>
                  </div>
                  <h2 className="text-3xl font-gilroy font-light mb-3 group-hover:text-gold transition-colors">
                    {dest.name}
                  </h2>
                  <p className="text-white/80 text-sm mb-4">
                    {dest.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-gold font-medium group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
