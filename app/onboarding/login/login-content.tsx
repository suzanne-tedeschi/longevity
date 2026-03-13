'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured, ensureProfile, upsertProfile } from '@/lib/supabase'

type AuthMode = 'login' | 'signup'

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || null

export default function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode: AuthMode = searchParams.get('mode') === 'login' ? 'login' : 'signup'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const getPendingOnboarding = () => {
    try {
      const raw = localStorage.getItem('evo_onboarding_data')
      if (!raw) return null
      return JSON.parse(raw) as {
        firstName?: string
        age?: string | number
        height?: string | number
        weight?: string | number
        [key: string]: unknown
      }
    } catch {
      return null
    }
  }

  const applyPendingOnboarding = async (user: { id: string; user_metadata?: Record<string, unknown> }) => {
    if (!supabase) return false

    const pending = getPendingOnboarding()
    if (!pending) return false

    const payload = {
      ...pending,
      completedAt: new Date().toISOString(),
    }

    const firstNameFromPending = typeof pending.firstName === 'string' ? pending.firstName.trim() : ''
    const ageNumber = Number(pending.age)
    const heightNumber = Number(pending.height)
    const weightNumber = Number(pending.weight)

    await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        first_name: firstNameFromPending || (user.user_metadata?.first_name as string) || '',
        evo_onboarding_completed: true,
        evo_onboarding: payload,
      },
    })

    await upsertProfile({
      id: user.id,
      first_name: firstNameFromPending || (user.user_metadata?.first_name as string) || '',
      age: Number.isFinite(ageNumber) ? ageNumber : null,
      height: Number.isFinite(heightNumber) ? heightNumber : null,
      weight: Number.isFinite(weightNumber) ? weightNumber : null,
      activity_frequency: (pending.activityFrequency as string) || '',
      weekly_activities: Array.isArray(pending.weeklyActivities) ? (pending.weeklyActivities as string[]) : [],
      agenda_sessions: Array.isArray(pending.agendaSessions) ? (pending.agendaSessions as Record<string, unknown>[]) : [],
      agenda_mode: (pending.agendaMode as string) || '',
      google_calendar_wanted: pending.googleCalendarWanted ? Boolean(pending.googleCalendarWanted) : null,
      google_calendar_connected: Boolean(pending.googleCalendarConnected),
      limitations: Array.isArray(pending.limitations) ? (pending.limitations as string[]) : [],
      joint_pain_where: (pending.jointPainWhere as string) || '',
      muscle_pain_where: (pending.musclePainWhere as string) || '',
      other_limitation: (pending.otherLimitation as string) || '',
      evo_usage: Array.isArray(pending.evoUsage) ? (pending.evoUsage as string[]).join(', ') : (pending.evoUsage as string) || '',
      priorities: Array.isArray(pending.priorities) ? (pending.priorities as string[]) : [],
      diet: (pending.diet as string) || '',
      other_diet: (pending.otherDiet as string) || '',
      coach_tone: (pending.coachTone as string) || '',
      expectations: (pending.expectations as string) || '',
      onboarding_data: payload as Record<string, unknown>,
      onboarding_completed_at: payload.completedAt,
    })

    if (firstNameFromPending) {
      localStorage.setItem('evo_user_name', firstNameFromPending)
    }
    localStorage.setItem('evo_onboarding_completed', 'true')
    localStorage.removeItem('evo_onboarding_data')

    return true
  }

  useEffect(() => {
    async function loadPendingAndCheckAuth() {
      const pending = getPendingOnboarding()
      if (pending?.firstName && !firstName) {
        setFirstName(String(pending.firstName))
      }

      if (!isSupabaseConfigured || !supabase) return

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        // If already authenticated (e.g. just returned from Google OAuth), redirect directly
        if (session?.user) {
          await applyPendingOnboarding(session.user)
          router.push('/onboarding/bilans')
        }
      } catch {
        // Silently ignore auth errors
      }
    }
    loadPendingAndCheckAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Service indisponible. Réessayez plus tard.')
      return
    }
    setLoading(true)
    setErrorMsg('')

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            },
          },
        })
        if (error) {
          setErrorMsg(error.message === 'User already registered'
            ? 'Cet email est déjà utilisé. Essayez de vous connecter.'
            : error.message === 'Email rate limit exceeded'
            ? 'Trop de tentatives. Veuillez patienter quelques minutes.'
            : error.message)
          setLoading(false)
          return
        }
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          })
          if (signInError) {
            localStorage.setItem('evo_user_name', firstName.trim())
          }
        }
        await ensureProfile()
        localStorage.setItem('evo_user_name', firstName.trim())
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })
        if (error) {
          setErrorMsg(error.message === 'Invalid login credentials'
            ? 'Email ou mot de passe incorrect.'
            : error.message)
          setLoading(false)
          return
        }
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (mode === 'login') {
        router.push('/onboarding/bilans')
      } else {
        if (session?.user) await applyPendingOnboarding(session.user)
        router.push('/onboarding/bilans')
      }
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.')
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google') => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Service indisponible. Réessayez plus tard.')
      return
    }
    setLoading(true)
    setErrorMsg('')
    const nextPath = mode === 'login' ? '/onboarding/bilans' : '/onboarding/login?mode=signup'
    const redirectBase = appUrl || window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#FAF8F5]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)'
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(45,106,79,0.03) 0%, transparent 70%)'
        }} />
      </div>

      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-light tracking-wide text-[#1a1a1a]/90">evo</Link>
        </div>

        <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#1a1a1a]/[0.08]">
          <h1 className="text-xl font-bold text-[#1a1a1a] mb-6 text-center">
            {mode === 'signup' ? 'Créer votre compte' : 'Se connecter'}
          </h1>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#1a1a1a]/[0.1] bg-white hover:bg-[#1a1a1a]/[0.04] hover:border-[#1a1a1a]/[0.12] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-[#1a1a1a]/60">
                {mode === 'signup' ? 'Créer avec Google' : 'Continuer avec Google'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1a1a1a]/[0.06]" />
            <span className="text-xs text-[#1a1a1a]/30 font-medium">ou</span>
            <div className="flex-1 h-px bg-[#1a1a1a]/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1a1a1a]/[0.1] bg-white text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/20 focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all duration-300"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#1a1a1a]/[0.1] bg-white text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/20 focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all duration-300"
                    placeholder="Nom"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#1a1a1a]/[0.1] bg-white text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/20 focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all duration-300"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1a1a1a]/50 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-xl border border-[#1a1a1a]/[0.1] bg-white text-[#1a1a1a] text-sm placeholder:text-[#1a1a1a]/20 focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all duration-300"
                placeholder="8 caractères minimum"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3 !text-base !rounded-xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Chargement...
                </span>
              ) : (
                mode === 'signup' ? 'Créer mon compte' : 'Se connecter'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#1a1a1a]/20 mt-6">
          En continuant, vous acceptez nos{' '}
          <Link href="#" className="underline hover:text-[#1a1a1a]/40">conditions d&apos;utilisation</Link>
          {' '}et notre{' '}
          <Link href="#" className="underline hover:text-[#1a1a1a]/40">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  )
}
