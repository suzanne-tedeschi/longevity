'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured, ensureProfile } from '@/lib/supabase'

/**
 * /auth/callback — Client-side OAuth callback page.
 *
 * After the user authenticates with Google (or any OAuth provider),
 * Supabase redirects here with ?code=... in the URL.
 *
 * We use the **client-side** Supabase instance to exchange the code
 * because it has access to the PKCE code_verifier stored in localStorage
 * during the initial signInWithOAuth() call.
 *
 * A server-side route handler cannot access localStorage, which is why
 * the exchange must happen on the client.
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase non configuré.')
        return
      }

      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (!code) {
        // No code — maybe user navigated here directly, try to get existing session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.replace('/onboarding/bilans')
        } else {
          router.replace('/onboarding/login')
        }
        return
      }

      try {
        // Exchange the authorization code for a session.
        // The client-side Supabase lib automatically includes the PKCE code_verifier.
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('[auth/callback] Code exchange failed:', exchangeError.message)
          setError(exchangeError.message)
          return
        }

        if (data.session) {
          // Create/update the profile row
          await ensureProfile()
          router.replace('/onboarding/bilans')
        } else {
          setError('Session non obtenue.')
        }
      } catch (err) {
        console.error('[auth/callback] Unexpected error:', err)
        setError('Erreur lors de la connexion.')
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center px-6">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.push('/onboarding/login')}
            className="text-sm text-[#2d6a4f] underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#2d6a4f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#1a1a1a]/60">Connexion en cours…</p>
      </div>
    </div>
  )
}
