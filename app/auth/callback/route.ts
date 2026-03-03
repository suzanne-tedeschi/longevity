import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)

    // Create/update profile for OAuth users
    if (session?.user) {
      const user = session.user
      const profile = {
        id: user.id,
        first_name: user.user_metadata?.first_name
          || user.user_metadata?.full_name?.split(' ')[0]
          || '',
        last_name: user.user_metadata?.last_name
          || user.user_metadata?.full_name?.split(' ').slice(1).join(' ')
          || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      }
      await supabase.from('profiles').upsert(profile, { onConflict: 'id' })
    }
  }

  return NextResponse.redirect(new URL('/onboarding/welcome', request.url))
}
