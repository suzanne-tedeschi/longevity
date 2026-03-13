import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const oauthCode = request.nextUrl.searchParams.get('code')

  if (oauthCode && pathname !== '/auth/callback') {
    const callbackUrl = request.nextUrl.clone()
    callbackUrl.pathname = '/auth/callback'
    callbackUrl.searchParams.set('code', oauthCode)
    if (!callbackUrl.searchParams.get('next')) {
      callbackUrl.searchParams.set('next', '/onboarding/bilans')
    }
    return NextResponse.redirect(callbackUrl)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT add code between createServerClient and getUser().
  // A small mistake here can cause very hard-to-debug random logouts.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isBilansRoute = pathname.startsWith('/onboarding/bilans')
  const isProfilRoute = pathname.startsWith('/onboarding/profil')
  const isOnboardingDone = Boolean(user?.user_metadata?.evo_onboarding_completed)

  if (user && isBilansRoute && !isOnboardingDone) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding/profil'
    return NextResponse.redirect(url)
  }

  if (user && isProfilRoute && isOnboardingDone) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding/bilans'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (images, videos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mov|mp4)$).*)',
  ],
}
