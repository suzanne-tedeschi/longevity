import { NextResponse } from 'next/server'
import { safeEqual, signState } from '@/lib/server/calendar-crypto'
import {
  exchangeCodeForTokens,
  syncGoogleCalendarForUser,
  upsertGoogleConnection,
} from '@/lib/server/google-calendar'

type StatePayload = { uid: string; next: string; ts: number }

function parseAndValidateState(rawState: string | null): StatePayload | null {
  if (!rawState) return null
  const [payloadBase64, signature] = rawState.split('.')
  if (!payloadBase64 || !signature) return null

  const expectedSignature = signState(payloadBase64)
  if (!safeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as StatePayload
    if (!payload.uid || !payload.next || !payload.ts) return null
    if (!payload.next.startsWith('/')) return null
    if (Date.now() - payload.ts > 15 * 60 * 1000) return null
    return payload
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const statePayload = parseAndValidateState(url.searchParams.get('state'))

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 })
  }

  const redirectBase = statePayload?.next || '/onboarding/profil'

  if (!code || !statePayload) {
    return NextResponse.redirect(new URL(`${redirectBase}?calendar=error`, appUrl))
  }

  try {
    const tokens = await exchangeCodeForTokens(code)
    await upsertGoogleConnection({ userId: statePayload.uid, tokens })
    await syncGoogleCalendarForUser(statePayload.uid)
    return NextResponse.redirect(new URL(`${redirectBase}?calendar=connected`, appUrl))
  } catch (error) {
    console.error('Google calendar callback error:', error)
    return NextResponse.redirect(new URL(`${redirectBase}?calendar=error`, appUrl))
  }
}
