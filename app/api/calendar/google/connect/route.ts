import { NextResponse } from 'next/server'
import { buildGoogleAuthUrl } from '@/lib/server/google-calendar'
import { getUserFromBearerToken } from '@/lib/server/supabase-admin'
import { signState } from '@/lib/server/calendar-crypto'

export async function POST(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => ({}))) as { next?: string }
    const nextPath =
      typeof body.next === 'string' && body.next.startsWith('/') ? body.next : '/onboarding/profil'

    const payloadBase64 = Buffer.from(
      JSON.stringify({
        uid: user.id,
        next: nextPath,
        ts: Date.now(),
      })
    ).toString('base64url')
    const signature = signState(payloadBase64)
    const state = `${payloadBase64}.${signature}`

    const url = buildGoogleAuthUrl(state)
    return NextResponse.json({ url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start OAuth flow'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
