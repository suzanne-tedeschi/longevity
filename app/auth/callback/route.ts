import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * /auth/callback — Server-side OAuth callback.
 *
 * After the user authenticates via Google (or email link), Supabase redirects
 * here with ?code=... The PKCE code_verifier is stored in cookies by
 * @supabase/ssr (set during signInWithOAuth on the client), so the server
 * can exchange the code without needing localStorage.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/onboarding/bilans'

  if (code) {
    // Build the redirect response first so we can attach cookies to it
    const redirectTo = new URL('/onboarding/bilans', request.url)
    const response = NextResponse.redirect(redirectTo)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      const user = data.session.user

      const isOnboardingCompleted = Boolean(
        user.user_metadata?.evo_onboarding_completed
      )

      const destination = isOnboardingCompleted
        ? '/onboarding/bilans'
        : next

      const finalResponse = NextResponse.redirect(new URL(destination, request.url))
      // Copy all cookies (session tokens) to the final redirect response
      response.cookies.getAll().forEach(({ name, value, ...options }) => {
        finalResponse.cookies.set(name, value, options)
      })

      if (!isOnboardingCompleted) {
        const profile = {
          id: user.id,
          first_name:
            user.user_metadata?.first_name ||
            user.user_metadata?.full_name?.split(' ')[0] ||
            '',
          last_name:
            user.user_metadata?.last_name ||
            user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ||
            '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        }
        await supabase.from('profiles').upsert(profile, { onConflict: 'id' })
      }

      return finalResponse
    }

    // Code exchange failed — redirect to login with error hint
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(
      new URL('/onboarding/login?mode=login&error=auth', request.url)
    )
  }

  // No code parameter — redirect to login
  return NextResponse.redirect(new URL('/onboarding/login?mode=login', request.url))
}
