'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function GuestLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert(isLogin ? 'Login functionality coming soon!' : 'Registration functionality coming soon!')
  }

  return (
    <main className="min-h-screen bg-ink text-snow">
      <Navigation />
      
      <section className="pt-32 pb-16 min-h-screen flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-gilroy font-light mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-white/60">
              {isLogin ? 'Sign in to access your bookings' : 'Join Silqhaus for exclusive benefits'}
            </p>
          </div>

          <div className="bg-ink-2 p-8 rounded-2xl border border-line">
            <div className="flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  isLogin ? 'text-gold border-b-2 border-gold' : 'text-white/50 border-b border-line'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  !isLogin ? 'text-gold border-b-2 border-gold' : 'text-white/50 border-b border-line'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-ink border border-line rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-ink border border-line rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-ink border border-line rounded-lg pl-12 pr-4 py-3 text-white focus:border-gold focus:outline-none"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link href="#" className="text-sm text-gold hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
