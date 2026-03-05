import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getUserFromBearerToken } from '@/lib/server/supabase-admin'

export async function GET(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()
    const { data, error } = await admin
      .from('calendar_connections')
      .select('provider_account_email, last_sync_at, status')
      .eq('user_id', user.id)
      .eq('provider', 'google')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      connected: Boolean(data),
      email: data?.provider_account_email ?? null,
      lastSyncAt: data?.last_sync_at ?? null,
      status: data?.status ?? null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load status'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
