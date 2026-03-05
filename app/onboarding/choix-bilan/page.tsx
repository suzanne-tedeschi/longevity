'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BilanOption {
  id: string
  title: string
  description: string
  duration: string
  icon: React.ReactNode
  available: boolean
  href: string
}

const bilanOptions: BilanOption[] = [
  {
    id: 'condition-physique',
    title: 'Condition physique',
    description: '43 tests scientifiques pour évaluer votre mobilité, force, équilibre et souplesse.',
    duration: '15 min',
    available: true,
    href: '/onboarding/bilan-mobilite',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5l11 11" />
        <path d="M3 10l1-1 3 3" />
        <path d="M14 3l1-1 4 4-1 1" />
        <path d="M21 14l-1 1-3-3" />
        <path d="M10 21l-1 1-4-4 1-1" />
      </svg>
    ),
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Analysez vos habitudes alimentaires et identifiez les leviers pour une alimentation longévité.',
    duration: '10 min',
    available: false,
    href: '#',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: 'sommeil',
    title: 'Sommeil',
    description: 'Évaluez la qualité de votre sommeil et découvrez comment optimiser votre récupération.',
    duration: '8 min',
    available: false,
    href: '#',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  {
    id: 'sante-emotionnelle',
    title: 'Santé émotionnelle',
    description: 'Mesurez votre bien-être émotionnel et identifiez les sources de déséquilibre.',
    duration: '10 min',
    available: false,
    href: '#',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    id: 'stress',
    title: 'Stress',
    description: 'Évaluez votre niveau de stress et apprenez des techniques de gestion adaptées.',
    duration: '8 min',
    available: false,
    href: '#',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
]

export default function ChoixBilanPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(new Array(bilanOptions.length).fill(false))

  useEffect(() => {
    setMounted(true)
    const timers = bilanOptions.map((_, i) =>
      setTimeout(() => {
        setCardsVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 200 + i * 120)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#FAF8F5]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 60%)'
        }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(45,106,79,0.03) 0%, transparent 70%)'
        }} />
      </div>

      {/* Top bar */}
      <nav className="w-full px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-light tracking-wide text-[#1a1a1a]/90">evo</Link>
        <button
          onClick={() => router.back()}
          className="text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60 transition-colors duration-300 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Retour
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight">
            Choisissez votre <span className="text-[#2D6A4F]">bilan</span>
          </h1>
          <p className="text-lg text-[#1a1a1a]/50 max-w-lg mx-auto">
            Sélectionnez un domaine à évaluer pour construire votre plan de longévité personnalisé.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {bilanOptions.map((bilan, index) => (
            <div
              key={bilan.id}
              className={`transition-all duration-500 ease-out ${
                cardsVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {bilan.available ? (
                <button
                  onClick={() => router.push(bilan.href)}
                  className="w-full text-left group relative bg-white backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#1a1a1a]/[0.08] hover:border-[#2D6A4F]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 flex items-center justify-center flex-shrink-0 text-[#2D6A4F] group-hover:from-[#2D6A4F]/15 group-hover:to-[#1B4332]/15 transition-all duration-500">
                      {bilan.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] group-hover:text-[#2D6A4F] transition-colors duration-300">
                          {bilan.title}
                        </h3>
                        <span className="text-xs font-medium text-[#1a1a1a]/30 bg-[#1a1a1a]/[0.04] px-2.5 py-0.5 rounded-full">
                          {bilan.duration}
                        </span>
                      </div>
                      <p className="text-sm text-[#1a1a1a]/50 leading-relaxed">
                        {bilan.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 mt-3 text-[#1a1a1a]/20 group-hover:text-[#2D6A4F] transition-all duration-300 group-hover:translate-x-1">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover gold line */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                </button>
              ) : (
                <div className="w-full text-left relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#1a1a1a]/[0.06] opacity-60 cursor-default">
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-[#1a1a1a]/[0.03] flex items-center justify-center flex-shrink-0 text-[#1a1a1a]/20">
                      {bilan.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-lg font-semibold text-[#1a1a1a]/30">
                          {bilan.title}
                        </h3>
                        <span className="text-xs font-medium text-[#1a1a1a] bg-[#1a1a1a]/[0.08] px-2.5 py-0.5 rounded-full">
                          Bientôt disponible
                        </span>
                      </div>
                      <p className="text-sm text-[#1a1a1a]/30 leading-relaxed">
                        {bilan.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
