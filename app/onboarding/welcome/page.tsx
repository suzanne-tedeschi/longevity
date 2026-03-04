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
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 60%)'
        }} />
      </div>

      {/* Top bar */}
      <nav className="w-full px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-white">E</span><span className="text-[#c9a96e]">vo</span>
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Greeting */}
        <div
          className={`text-center mb-6 transition-all duration-700 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light text-white leading-tight tracking-tight mb-2">
            Bonjour {firstName} !
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-white leading-tight tracking-tight">
            Bienvenu<span className="text-[#c9a96e]">(e)</span> dans votre
          </h2>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight mt-1">
            <span className="text-[#c9a96e]">hub de longévité</span>
          </h2>
        </div>

        {/* Description */}
        <div
          className={`text-center mb-8 transition-all duration-700 ease-out delay-100 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-[#c9a96e] to-[#a08050] mx-auto mb-6" />
          <p className="text-lg text-white/50 leading-relaxed max-w-md mx-auto">
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
          className={`mt-8 text-xs text-white/20 max-w-xs text-center leading-relaxed transition-all duration-700 ease-out delay-200 ${
            ctaVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Cela ne prendra que quelques minutes.
        </p>
      </div>
    </div>
  )
}
