'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactGuest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    checkIn: '',
    checkOut: '',
    guests: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your inquiry! We will get back to you shortly.')
  }

  return (
    <main className="min-h-screen bg-ink text-snow">
      <Navigation />
      
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-gilroy font-light mb-4">
              Book Your <span className="text-gold">Stay</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Ready to experience luxury? Get in touch with our team to start planning your perfect getaway.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-gilroy mb-8">Get In Touch</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <p className="text-white/60">hello@silqhaus.com</p>
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
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Location</h3>
                    <p className="text-white/60">Phuket & Pattaya, Thailand</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ink-2 p-8 rounded-2xl border border-line">
              <h2 className="text-2xl font-gilroy mb-6">Inquiry Form</h2>
              
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
                    <label className="block text-sm text-white/70 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
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
                    <label className="block text-sm text-white/70 mb-2">Number of Guests</label>
                    <input
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none resize-none"
                    placeholder="Tell us about your ideal stay..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Inquiry
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
