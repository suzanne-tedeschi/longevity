import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getUserFromBearerToken } from '@/lib/server/supabase-admin'

export async function POST(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = getSupabaseAdmin()
    await admin.from('calendar_connections').delete().eq('user_id', user.id).eq('provider', 'google')
    await admin.from('calendar_freebusy_cache').delete().eq('user_id', user.id).eq('provider', 'google')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}
