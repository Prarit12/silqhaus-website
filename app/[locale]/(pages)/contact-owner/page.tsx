'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Mail, Phone, Home, Send, Check } from 'lucide-react'

const benefits = [
  'Maximum visibility on major booking platforms',
  'Professional photography and marketing',
  'Dynamic pricing optimization',
  '24/7 guest support',
  'Regular property maintenance',
  'Transparent reporting and payouts',
]

export default function ContactOwner() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    location: '',
    bedrooms: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! Our team will contact you shortly.')
  }

  return (
    <main className="min-h-screen bg-ink text-snow">
      <Navigation />
      
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-gilroy font-light mb-4">
              Partner <span className="text-gold">With Us</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Let Silqhaus transform your property into a profitable luxury rental
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-gilroy mb-8">Why Choose Silqhaus?</h2>
              
              <div className="space-y-4 mb-12">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-white/80">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <p className="text-white/60">owners@silqhaus.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Phone</h3>
                    <p className="text-white/60">+66 (0) 80 835 0595</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ink-2 p-8 rounded-2xl border border-line">
              <h2 className="text-2xl font-gilroy mb-6">List Your Property</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Property Type</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                    >
                      <option value="">Select type</option>
                      <option value="villa">Villa</option>
                      <option value="condo">Condo</option>
                      <option value="apartment">Apartment</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                    >
                      <option value="">Select location</option>
                      <option value="phuket">Phuket</option>
                      <option value="pattaya">Pattaya</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Tell us about your property</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Submit Property
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
