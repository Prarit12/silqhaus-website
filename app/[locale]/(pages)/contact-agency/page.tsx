'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Mail, Phone, Building2, Send, Handshake } from 'lucide-react'

export default function ContactAgency() {
  const [formData, setFormData] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! Our partnerships team will contact you shortly.')
  }

  return (
    <main className="min-h-screen bg-ink text-snow">
      <Navigation />
      
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-gilroy font-light mb-4">
              Agency <span className="text-gold">Partnerships</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Partner with Silqhaus to offer your clients exclusive access to luxury Thai villas
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-gilroy mb-8">Partnership Benefits</h2>
              
              <div className="space-y-6 mb-12">
                <div className="bg-ink-2 p-6 rounded-xl border border-line">
                  <h3 className="text-lg font-semibold text-white mb-2">Competitive Commissions</h3>
                  <p className="text-white/60">Earn attractive commissions on every booking you refer to us.</p>
                </div>
                <div className="bg-ink-2 p-6 rounded-xl border border-line">
                  <h3 className="text-lg font-semibold text-white mb-2">Exclusive Inventory</h3>
                  <p className="text-white/60">Access to our curated portfolio of luxury villas before they hit the market.</p>
                </div>
                <div className="bg-ink-2 p-6 rounded-xl border border-line">
                  <h3 className="text-lg font-semibold text-white mb-2">Dedicated Support</h3>
                  <p className="text-white/60">A dedicated account manager to assist with all your clients\' needs.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <p className="text-white/60">partners@silqhaus.com</p>
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
              <div className="flex items-center gap-3 mb-6">
                <Handshake className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-gilroy">Become a Partner</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Agency Name</label>
                  <input
                    type="text"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
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
                    <label className="block text-sm text-white/70 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg px-4 py-3 text-white focus:border-gold focus:outline-none"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Tell us about your agency</label>
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
                  <Building2 className="w-5 h-5" />
                  Apply for Partnership
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
