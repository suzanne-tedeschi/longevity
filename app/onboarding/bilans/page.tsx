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
    description: 'Évaluez vos symptômes digestifs et votre confort intestinal avec le questionnaire GSRS.',
    duration: '5 min',
    available: true,
    href: '/onboarding/bilan-digestif',
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
    duration: '10 min',
    available: true,
    href: '/onboarding/bilan-sommeil',
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
    title: 'Gestion du stress',
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

export default function BilansPage() {
  const router = useRouter()
  const [titleVisible, setTitleVisible] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(new Array(bilanOptions.length).fill(false))

  useEffect(() => {
    const timers = [
      setTimeout(() => setTitleVisible(true), 200),
      setTimeout(() => setTextVisible(true), 600),
      ...bilanOptions.map((_, i) =>
        setTimeout(() => {
          setCardsVisible(prev => {
            const next = [...prev]
            next[i] = true
            return next
          })
        }, 900 + i * 120)
      ),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Title */}
        <div
          className={`text-center mb-4 transition-all duration-700 ease-out ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-navy-dark leading-tight tracking-tight mb-2">
            Vos <span className="gradient-text">évaluations</span>
          </h1>
        </div>

        {/* Description */}
        <div
          className={`text-center mb-4 transition-all duration-700 ease-out delay-100 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-lg text-navy/70 leading-relaxed max-w-lg mx-auto">
            Pour construire votre plan de longévité personnalisé, nous avons préparé plusieurs bilans scientifiques.
          </p>
        </div>

        {/* Decorative line */}
        <div
          className={`mb-8 flex justify-center transition-all duration-700 ease-out ${
            textVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        >
          <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-bordeaux to-gold" />
        </div>

        {/* Subtitle */}
        <div
          className={`text-center mb-8 transition-all duration-700 ease-out ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-base text-navy/50 italic">
            Commencez par ce que vous souhaitez — chaque bilan se fait à votre rythme.
          </p>
        </div>

        {/* Bilan cards - horizontal grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  className="w-full h-full text-center group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gold/10 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-dark/5 to-bordeaux/5 flex items-center justify-center text-navy-dark group-hover:from-navy-dark/10 group-hover:to-bordeaux/10 transition-all duration-500">
                      {bilan.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-navy-dark group-hover:text-bordeaux transition-colors duration-300 leading-tight">
                      {bilan.title}
                    </h3>
                    <p className="text-xs text-navy/50 leading-relaxed line-clamp-3">
                      {bilan.description}
                    </p>
                    <span className="text-[11px] font-medium text-navy/40 bg-beige-200 px-2 py-0.5 rounded-full">
                      {bilan.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-bordeaux to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                </button>
              ) : (
                <div className="w-full h-full text-center relative bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 opacity-50 cursor-default">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-navy/30">
                      {bilan.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-navy/40 leading-tight">
                      {bilan.title}
                    </h3>
                    <p className="text-xs text-navy/30 leading-relaxed line-clamp-3">
                      {bilan.description}
                    </p>
                    <span className="text-[11px] font-medium text-white bg-navy/30 px-2 py-0.5 rounded-full">
                      Bientôt
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div
          className={`mt-10 text-center transition-all duration-700 ease-out delay-300 ${
            cardsVisible[bilanOptions.length - 1] ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-sm text-navy/40">
            Vous pourrez compléter les autres bilans à tout moment.
          </p>
        </div>
      </div>
    </div>
  )
}
