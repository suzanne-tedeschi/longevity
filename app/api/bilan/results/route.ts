import { NextResponse } from 'next/server'
import { getUserFromBearerToken, getSupabaseAdmin } from '@/lib/server/supabase-admin'

export async function GET(request: Request) {
  try {
    const user = await getUserFromBearerToken(request.headers.get('authorization'))
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = getSupabaseAdmin()

    // Get all results ordered by date (newest first)
    const { data, error } = await admin
      .from('bilan_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) throw error

    // Group by bilan_type: latest + previous score for delta
    const grouped: Record<string, { latest: typeof data[0]; previousScore: number | null; attempt: number }> = {}
    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      const t = row.bilan_type
      counts[t] = (counts[t] ?? 0) + 1
      if (!grouped[t]) {
        grouped[t] = { latest: row, previousScore: null, attempt: 0 }
      } else if (grouped[t].previousScore === null && counts[t] === 2) {
        grouped[t].previousScore = row.global_score
      }
    }
    // Set attempt number
    for (const t of Object.keys(grouped)) {
      grouped[t].attempt = counts[t] ?? 1
    }

    // Return latest result enriched with delta info
    const results = Object.values(grouped).map(g => ({
      ...g.latest,
      previous_score: g.previousScore,
      delta: g.previousScore !== null ? g.latest.global_score - g.previousScore : null,
      attempt: g.attempt,
    }))

    return NextResponse.json({ ok: true, results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fetch failed'
    console.error('[bilan/results]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
