'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const activityLevels = [
  { value: 'jamais', label: 'Jamais', description: 'Aucune activité physique régulière' },
  { value: 'irregulier', label: 'Pas régulièrement', description: 'Quelques fois par mois' },
  { value: '1x', label: '1 fois / semaine', description: 'Une séance hebdomadaire' },
  { value: '2x', label: '2 fois / semaine', description: 'Deux séances hebdomadaires' },
  { value: '3x+', label: '3+ fois / semaine', description: 'Trois séances ou plus' },
]

export default function ProfilPage() {
  const router = useRouter()
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('')
  const [step, setStep] = useState(0) // 0=age, 1=height, 2=weight, 3=activity

  const steps = [
    { label: 'Âge', value: age },
    { label: 'Taille', value: height },
    { label: 'Poids', value: weight },
    { label: 'Activité', value: activity },
  ]

  const canContinue = () => {
    switch (step) {
      case 0: return age !== '' && Number(age) > 0 && Number(age) < 120
      case 1: return height !== '' && Number(height) > 50 && Number(height) < 250
      case 2: return weight !== '' && Number(weight) > 20 && Number(weight) < 300
      case 3: return activity !== ''
      default: return false
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save to localStorage
      localStorage.setItem('evo_profil', JSON.stringify({ age, height, weight, activity }))
      router.push('/onboarding/bilans')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canContinue()) handleNext()
  }

  const pct = ((step + 1) / 4) * 100

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-beige-100/90 backdrop-blur-md border-b border-beige-300">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step > 0) setStep(step - 1)
              else router.push('/onboarding/welcome')
            }}
            className="flex items-center gap-1 text-sm text-navy/50 hover:text-navy-dark transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-navy/40">{step + 1}/4</span>
            <div className="w-24 h-1 bg-beige-300 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-bordeaux to-gold transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link href="/onboarding/welcome" className="text-xs text-navy/30 hover:text-navy/60 transition-colors">Quitter</Link>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-12">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < step ? 'bg-gold' : i === step ? 'bg-bordeaux scale-125' : 'bg-beige-300'
              }`} />
              {i < steps.length - 1 && <div className="w-8 h-px bg-beige-300" />}
            </div>
          ))}
        </div>

        {/* Age */}
        {step === 0 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-bordeaux/10 to-gold/10 border border-bordeaux/15 flex items-center justify-center text-bordeaux mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight mb-2">Quel est votre âge ?</h2>
            <p className="text-sm text-navy/50 mb-8">Cette information nous aide à personnaliser vos recommandations.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="55"
                autoFocus
                className="w-full text-center text-5xl font-bold text-navy-dark bg-transparent border-b-2 border-beige-300 focus:border-bordeaux outline-none py-3 transition-colors placeholder:text-navy/15"
              />
              <p className="text-xs text-navy/30 mt-2">ans</p>
            </div>
          </div>
        )}

        {/* Height */}
        {step === 1 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-bordeaux/10 to-gold/10 border border-bordeaux/15 flex items-center justify-center text-bordeaux mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M8 4h8" />
                <path d="M8 20h8" />
                <path d="M10 8h4" />
                <path d="M10 12h4" />
                <path d="M10 16h4" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight mb-2">Quelle est votre taille ?</h2>
            <p className="text-sm text-navy/50 mb-8">En centimètres.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="170"
                autoFocus
                className="w-full text-center text-5xl font-bold text-navy-dark bg-transparent border-b-2 border-beige-300 focus:border-bordeaux outline-none py-3 transition-colors placeholder:text-navy/15"
              />
              <p className="text-xs text-navy/30 mt-2">cm</p>
            </div>
          </div>
        )}

        {/* Weight */}
        {step === 2 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-bordeaux/10 to-gold/10 border border-bordeaux/15 flex items-center justify-center text-bordeaux mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a4 4 0 014 4c0 .73-.2 1.41-.54 2H8.54A3.97 3.97 0 018 7a4 4 0 014-4z" />
                <path d="M4 9h16l-1.5 10a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 9z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight mb-2">Quel est votre poids ?</h2>
            <p className="text-sm text-navy/50 mb-8">En kilogrammes.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="70"
                autoFocus
                className="w-full text-center text-5xl font-bold text-navy-dark bg-transparent border-b-2 border-beige-300 focus:border-bordeaux outline-none py-3 transition-colors placeholder:text-navy/15"
              />
              <p className="text-xs text-navy/30 mt-2">kg</p>
            </div>
          </div>
        )}

        {/* Activity level */}
        {step === 3 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-bordeaux/10 to-gold/10 border border-bordeaux/15 flex items-center justify-center text-bordeaux mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark tracking-tight mb-2">Votre activité physique ?</h2>
            <p className="text-sm text-navy/50 mb-8">À quelle fréquence pratiquez-vous une activité sportive ?</p>
            <div className="space-y-2.5 text-left">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivity(level.value)}
                  className={`w-full rounded-xl border-2 p-4 transition-all duration-300 ease-out text-left ${
                    activity === level.value
                      ? 'bg-bordeaux/5 border-bordeaux/30 ring-2 ring-bordeaux/20 shadow-md'
                      : 'border-beige-300 bg-white hover:border-navy/20 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      activity === level.value ? 'border-bordeaux bg-bordeaux' : 'border-beige-400'
                    }`}>
                      {activity === level.value && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm transition-colors duration-300 ${activity === level.value ? 'text-bordeaux' : 'text-navy-dark'}`}>
                        {level.label}
                      </p>
                      <p className="text-xs text-navy/50">{level.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Continue button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              canContinue()
                ? 'bg-navy-dark text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-beige-300 text-navy/30 cursor-not-allowed'
            }`}
          >
            {step < 3 ? 'Continuer' : 'Terminer'}
          </button>
        </div>
      </main>
    </div>
  )
}
