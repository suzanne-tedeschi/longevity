'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, isSupabaseConfigured, ensureProfile } from '@/lib/supabase'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signup')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

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
        // If no session returned (email confirmation enabled), sign in immediately
        if (!data.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
          })
          if (signInError) {
            // Can't sign in (email not confirmed) — store name locally and proceed anyway
            localStorage.setItem('evo_user_name', firstName.trim())
          }
        }
        // Create profile row (may fail if no session, that's ok)
        await ensureProfile()
        // Always store name locally as fallback
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
      router.push('/onboarding/welcome')
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.')
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Service indisponible. Réessayez plus tard.')
      return
    }
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)'
        }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-30" style={{
          background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)'
        }} />
      </div>

      <div className="w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-bold">
            <span className="text-white">E</span><span className="text-[#c9a96e]">vo</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/[0.08]">
          {/* Tabs */}
          <div className="flex mb-8 bg-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Créer un compte
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Se connecter
            </button>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-white/70">Continuer avec Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-sm font-medium text-white/70">Continuer avec Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.1]" />
            <span className="text-xs text-white/30 font-medium">ou</span>
            <div className="flex-1 h-px bg-white/[0.1]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all duration-300"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all duration-300"
                    placeholder="Nom"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all duration-300"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 transition-all duration-300"
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

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-6">
          En continuant, vous acceptez nos{' '}
          <Link href="#" className="underline hover:text-white/40">conditions d&apos;utilisation</Link>
          {' '}et notre{' '}
          <Link href="#" className="underline hover:text-white/40">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  )
}
