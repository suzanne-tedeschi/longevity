'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured, ensureProfile } from '@/lib/supabase'

export default function WelcomePage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [titleVisible, setTitleVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    async function loadUser() {
      if (isSupabaseConfigured && supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await ensureProfile()
          const name = user.user_metadata?.first_name
            || user.user_metadata?.full_name?.split(' ')[0]
            || user.email?.split('@')[0]
            || 'Utilisateur'
          setFirstName(name)
          return
        }
      }
      const localName = localStorage.getItem('evo_user_name')
      if (localName) {
        setFirstName(localName)
      } else {
        router.push('/onboarding/login')
      }
    }
    loadUser()

    const timers = [
      setTimeout(() => setTitleVisible(true), 200),
      setTimeout(() => setTextVisible(true), 600),
      setTimeout(() => setCtaVisible(true), 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [router])

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-beige-100">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 60%)'
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-50" style={{
          background: 'radial-gradient(circle, rgba(107,39,55,0.05) 0%, transparent 70%)'
        }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-50" style={{
          background: 'radial-gradient(circle, rgba(26,43,74,0.04) 0%, transparent 70%)'
        }} />
      </div>

      {/* Top bar */}
      <nav className="w-full px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-navy-dark">E</span><span className="gradient-text">vo</span>
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Greeting */}
        <div
          className={`text-center mb-6 transition-all duration-700 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-navy-dark leading-tight tracking-tight mb-2">
            Bonjour {firstName} !
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-navy-dark leading-tight tracking-tight">
            Bienvenu<span className="text-bordeaux">(e)</span> dans votre
          </h2>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight mt-1">
            <span className="gradient-text">hub de longévité</span>
          </h2>
        </div>

        {/* Description */}
        <div
          className={`text-center mb-8 transition-all duration-700 ease-out delay-100 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-bordeaux to-gold mx-auto mb-6" />
          <p className="text-lg text-navy/70 leading-relaxed max-w-md mx-auto">
            Nous allons construire ensemble votre programme de longévité personnalisé.
            Commençons par faire connaissance.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 ease-out ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={() => router.push('/onboarding/profil')}
            className="btn-secondary text-base px-10 py-4"
          >
            Commencer
          </button>
        </div>

        <p
          className={`mt-8 text-xs text-navy/30 max-w-xs text-center leading-relaxed transition-all duration-700 ease-out delay-200 ${
            ctaVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Cela ne prendra que quelques minutes.
        </p>
      </div>
    </div>
  )
}
