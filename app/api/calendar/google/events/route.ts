import { NextResponse } from 'next/server'
import { fetchGoogleEventsForUser } from '@/lib/server/google-calendar'
import { getUserFromBearerToken } from '@/lib/server/supabase-admin'

export async function GET(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const timeMin = url.searchParams.get('timeMin')
    const timeMax = url.searchParams.get('timeMax')

    if (!timeMin || !timeMax) {
      return NextResponse.json({ error: 'Missing timeMin or timeMax query params' }, { status: 400 })
    }

    const events = await fetchGoogleEventsForUser(user.id, timeMin, timeMax)
    return NextResponse.json({ events })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
