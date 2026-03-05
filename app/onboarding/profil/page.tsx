'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

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
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const [calendarLastSyncAt, setCalendarLastSyncAt] = useState<string | null>(null)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [calendarWorking, setCalendarWorking] = useState(false)
  const [calendarError, setCalendarError] = useState<string | null>(null)
  const [calendarResultMessage, setCalendarResultMessage] = useState<string | null>(null)

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get('calendar')
    if (result === 'connected') {
      setCalendarResultMessage('Google Agenda connecté. Disponibilités synchronisées.')
    } else if (result === 'error') {
      setCalendarResultMessage('Connexion Google impossible. Réessaie dans quelques instants.')
    }

    async function loadCalendarStatus() {
      try {
        if (!isSupabaseConfigured || !supabase) {
          setCalendarLoading(false)
          return
        }
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setCalendarLoading(false)
          return
        }

        const response = await fetch('/api/calendar/google/status', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const body = (await response.json()) as {
          connected?: boolean
          email?: string | null
          lastSyncAt?: string | null
          error?: string
        }
        if (!response.ok) {
          setCalendarError(body.error || 'Impossible de charger le statut Google Agenda.')
          setCalendarLoading(false)
          return
        }
        setCalendarConnected(Boolean(body.connected))
        setCalendarEmail(body.email ?? null)
        setCalendarLastSyncAt(body.lastSyncAt ?? null)
      } catch {
        setCalendarError('Impossible de charger le statut Google Agenda.')
      } finally {
        setCalendarLoading(false)
      }
    }

    loadCalendarStatus()
  }, [])

  const handleConnectCalendar = async () => {
    try {
      setCalendarError(null)
      setCalendarWorking(true)
      if (!isSupabaseConfigured || !supabase) {
        setCalendarError('Service indisponible pour connecter Google Agenda.')
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push('/onboarding/login')
        return
      }

      const response = await fetch('/api/calendar/google/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ next: '/onboarding/profil' }),
      })

      const body = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !body.url) {
        setCalendarError(body.error || 'Connexion Google impossible.')
        return
      }
      window.location.href = body.url
    } catch {
      setCalendarError('Connexion Google impossible.')
    } finally {
      setCalendarWorking(false)
    }
  }

  const handleSyncCalendar = async () => {
    try {
      setCalendarError(null)
      setCalendarWorking(true)
      if (!isSupabaseConfigured || !supabase) {
        setCalendarError('Service indisponible pour synchroniser Google Agenda.')
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push('/onboarding/login')
        return
      }

      const response = await fetch('/api/calendar/google/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const body = (await response.json()) as { error?: string; timeMax?: string }
      if (!response.ok) {
        setCalendarError(body.error || 'Synchronisation impossible.')
        return
      }
      setCalendarLastSyncAt(new Date().toISOString())
      setCalendarConnected(true)
    } catch {
      setCalendarError('Synchronisation impossible.')
    } finally {
      setCalendarWorking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#1a1a1a]/[0.08]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              if (step > 0) setStep(step - 1)
              else router.push('/onboarding/welcome')
            }}
            className="flex items-center gap-1 text-sm text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline">Retour</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-[#1a1a1a]/30">{step + 1}/4</span>
            <div className="w-24 h-1 bg-[#1a1a1a]/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link href="/onboarding/welcome" className="text-xs text-[#1a1a1a]/20 hover:text-[#1a1a1a]/40 transition-colors">Quitter</Link>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-12">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < step ? 'bg-[#2D6A4F]' : i === step ? 'bg-[#2D6A4F] scale-125' : 'bg-[#1a1a1a]/[0.06]'
              }`} />
              {i < steps.length - 1 && <div className="w-8 h-px bg-[#1a1a1a]/[0.06]" />}
            </div>
          ))}
        </div>

        {/* Age */}
        {step === 0 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F] mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Quel est votre âge ?</h2>
            <p className="text-sm text-[#1a1a1a]/40 mb-8">Cette information nous aide à personnaliser vos recommandations.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="55"
                autoFocus
                className="w-full text-center text-5xl font-bold text-[#1a1a1a] bg-transparent border-b-2 border-[#1a1a1a]/[0.1] focus:border-[#2D6A4F] outline-none py-3 transition-colors placeholder:text-[#1a1a1a]/10"
              />
              <p className="text-xs text-[#1a1a1a]/20 mt-2">ans</p>
            </div>
          </div>
        )}

        {/* Height */}
        {step === 1 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F] mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M8 4h8" />
                <path d="M8 20h8" />
                <path d="M10 8h4" />
                <path d="M10 12h4" />
                <path d="M10 16h4" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Quelle est votre taille ?</h2>
            <p className="text-sm text-[#1a1a1a]/40 mb-8">En centimètres.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="170"
                autoFocus
                className="w-full text-center text-5xl font-bold text-[#1a1a1a] bg-transparent border-b-2 border-[#1a1a1a]/[0.1] focus:border-[#2D6A4F] outline-none py-3 transition-colors placeholder:text-[#1a1a1a]/10"
              />
              <p className="text-xs text-[#1a1a1a]/20 mt-2">cm</p>
            </div>
          </div>
        )}

        {/* Weight */}
        {step === 2 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F] mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a4 4 0 014 4c0 .73-.2 1.41-.54 2H8.54A3.97 3.97 0 018 7a4 4 0 014-4z" />
                <path d="M4 9h16l-1.5 10a2 2 0 01-2 1.5H7.5a2 2 0 01-2-1.5L4 9z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Quel est votre poids ?</h2>
            <p className="text-sm text-[#1a1a1a]/40 mb-8">En kilogrammes.</p>
            <div className="max-w-[200px] mx-auto">
              <input
                type="number"
                inputMode="numeric"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="70"
                autoFocus
                className="w-full text-center text-5xl font-bold text-[#1a1a1a] bg-transparent border-b-2 border-[#1a1a1a]/[0.1] focus:border-[#2D6A4F] outline-none py-3 transition-colors placeholder:text-[#1a1a1a]/10"
              />
              <p className="text-xs text-[#1a1a1a]/20 mt-2">kg</p>
            </div>
          </div>
        )}

        {/* Activity level */}
        {step === 3 && (
          <div className="animate-fade-in text-center">
            <div className="mb-2 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/10 to-[#1B4332]/10 border border-[#2D6A4F]/15 flex items-center justify-center text-[#2D6A4F] mx-auto">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">Votre activité physique ?</h2>
            <p className="text-sm text-[#1a1a1a]/40 mb-8">À quelle fréquence pratiquez-vous une activité sportive ?</p>
            <div className="space-y-2.5 text-left">
              {activityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivity(level.value)}
                  className={`w-full rounded-xl border-2 p-4 transition-all duration-300 ease-out text-left ${
                    activity === level.value
                      ? 'bg-[#2D6A4F]/10 border-[#2D6A4F]/30 ring-2 ring-[#2D6A4F]/20 shadow-md'
                      : 'border-[#1a1a1a]/[0.1] bg-white hover:border-[#1a1a1a]/[0.12] hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      activity === level.value ? 'border-[#2D6A4F] bg-[#2D6A4F]' : 'border-[#1a1a1a]/[0.12]'
                    }`}>
                      {activity === level.value && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm transition-colors duration-300 ${activity === level.value ? 'text-[#2D6A4F]' : 'text-[#1a1a1a]'}`}>
                        {level.label}
                      </p>
                      <p className="text-xs text-[#1a1a1a]/40">{level.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#1a1a1a]/[0.08] bg-white p-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">Google Agenda (optionnel)</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-1">
                    On synchronise tes créneaux occupés pour mieux adapter ton programme.
                  </p>
                </div>
                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${
                    calendarConnected
                      ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                      : 'bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/40'
                  }`}
                >
                  {calendarConnected ? 'Connecté' : 'Non connecté'}
                </span>
              </div>

              {calendarEmail && (
                <p className="text-xs text-[#1a1a1a]/40 mt-2">Compte: {calendarEmail}</p>
              )}
              {calendarLastSyncAt && (
                <p className="text-xs text-[#1a1a1a]/30 mt-1">
                  Dernière sync: {new Date(calendarLastSyncAt).toLocaleString('fr-FR')}
                </p>
              )}
              {calendarResultMessage && (
                <p className="text-xs text-[#2D6A4F] mt-2">{calendarResultMessage}</p>
              )}
              {calendarError && <p className="text-xs text-red-500 mt-2">{calendarError}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleConnectCalendar}
                  disabled={calendarWorking || calendarLoading}
                  className="px-3 py-2 rounded-lg text-xs font-semibold border border-[#1a1a1a]/[0.1] text-[#1a1a1a] hover:border-[#2D6A4F]/30 hover:text-[#2D6A4F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calendarConnected ? 'Reconnecter Google' : 'Connecter Google'}
                </button>
                {calendarConnected && (
                  <button
                    type="button"
                    onClick={handleSyncCalendar}
                    disabled={calendarWorking}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#2D6A4F] text-white hover:bg-[#24563f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Actualiser les disponibilités
                  </button>
                )}
              </div>
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
                ? 'bg-[#2D6A4F] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-[#1a1a1a]/[0.06] text-[#1a1a1a]/20 cursor-not-allowed'
            }`}
          >
            {step < 3 ? 'Continuer' : 'Terminer'}
          </button>
        </div>
      </main>
    </div>
  )
}
