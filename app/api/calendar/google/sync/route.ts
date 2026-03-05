import { NextResponse } from 'next/server'
import { syncGoogleCalendarForUser } from '@/lib/server/google-calendar'
import { getUserFromBearerToken } from '@/lib/server/supabase-admin'

export async function POST(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await syncGoogleCalendarForUser(user.id)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
