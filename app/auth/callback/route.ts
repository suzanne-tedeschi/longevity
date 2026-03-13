import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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
  const next = requestUrl.searchParams.get('next') ?? '/onboarding/profil'

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // May throw if called after response has started streaming.
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Create or update the profile row
      const user = data.session.user

      const isOnboardingCompleted = Boolean(
        user.user_metadata?.evo_onboarding_completed
      )

      if (isOnboardingCompleted) {
        return NextResponse.redirect(
          new URL('/onboarding/bilans', request.url)
        )
      }

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

      // Check if user already completed their profile questionnaire
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('age, height, weight')
        .eq('id', user.id)
        .single()

      if (
        existingProfile?.age &&
        existingProfile?.height &&
        existingProfile?.weight
      ) {
        return NextResponse.redirect(new URL(next, request.url))
      }

      return NextResponse.redirect(new URL(next, request.url))
    }

    // Code exchange failed — redirect to login with error hint
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(
      new URL('/onboarding/login?error=auth', request.url)
    )
  }

  // No code parameter — redirect to login
  return NextResponse.redirect(new URL('/onboarding/login', request.url))
}
