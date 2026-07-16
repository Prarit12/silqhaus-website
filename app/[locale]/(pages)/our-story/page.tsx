'use client'

import { Heart, Star, Globe, Sparkles } from 'lucide-react'

export default function OurStory() {
  return (
    <main className="min-h-screen bg-ink text-snow">
      
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-gilroy font-light mb-4">
            Our <span className="text-gold">Story</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            How a passion for hospitality became Thailand\'s premier luxury rental brand
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-invert mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-3xl font-gilroy m-0">The Beginning</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-8">
              Silqhaus was founded with a simple vision: to transform the way people experience luxury travel in Thailand. Our founders, seasoned hospitality professionals with deep roots in the Thai tourism industry, saw an opportunity to bridge the gap between property owners and discerning travelers seeking authentic, elevated experiences.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-3xl font-gilroy m-0">Our Philosophy</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-8">
              We believe that a vacation rental should be more than just a place to stay—it should be the foundation of unforgettable memories. Every property in our portfolio is personally inspected and must meet our rigorous standards for quality, location, and guest experience.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-3xl font-gilroy m-0">Local Expertise</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-8">
              Based in Thailand, we bring invaluable local knowledge to every stay. From hidden beach coves to the best authentic Thai restaurants, our team is dedicated to helping guests discover the real Thailand beyond the tourist trails.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-3xl font-gilroy m-0">Looking Forward</h2>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              As we continue to grow, our commitment remains unchanged: to provide exceptional properties, unparalleled service, and experiences that leave lasting impressions. We\'re not just in the business of vacation rentals—we\'re in the business of creating memories that last a lifetime.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
