import { NextResponse } from 'next/server'
import { getUserFromBearerToken, getSupabaseAdmin } from '@/lib/server/supabase-admin'

export async function GET(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()

    // Get latest result per bilan type
    const { data, error } = await admin
      .from('bilan_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) throw error

    // Deduplicate — keep only the latest per bilan_type
    const latest: Record<string, typeof data[0]> = {}
    for (const row of data ?? []) {
      if (!latest[row.bilan_type]) {
        latest[row.bilan_type] = row
      }
    }

    return NextResponse.json({ ok: true, results: Object.values(latest) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fetch failed'
    console.error('[bilan/results]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
